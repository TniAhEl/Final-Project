package com.example.demo.service.impl.auth;

import com.example.demo.dto.request.*;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.ReceiverResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.auth.ReceiverInfo;
import com.example.demo.model.auth.User;
import com.example.demo.model.product.Cart;
import com.example.demo.repository.auth.AdminRepository;
import com.example.demo.repository.auth.ReceiverInfoRepository;
import com.example.demo.repository.auth.UserRepository;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.util.JwtUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final EntityManager entityManager;
    private final CartRepository cartRepository;
    private final ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private ReceiverInfoRepository receiverInfoRepository;

    // User Registration
    public AuthResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) ||
                adminRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail()) ||
                adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        User saveUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUpdateAt(LocalDateTime.now());
        cart.setUser(saveUser);
        cartRepository.save(cart);


        String token = jwtUtil.generateToken(saveUser.getUsername(), "USER", saveUser.getId());
        return new AuthResponse(token, "USER", user.getId(), "User registered successfully");
    }

    // Admin Registration (typically done by super admin)
    public AuthResponse registerAdmin(AdminRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) ||
                adminRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail()) ||
                adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setAdminRole(request.getAdminRole());

        Admin savedAdmin = adminRepository.save(admin);

        String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN", savedAdmin.getId());
        return new AuthResponse(token, "ADMIN", admin.getId(), "Admin registered successfully");
    }

    // Login for both User and Admin
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Check if user exists in admin table
            Optional<Admin> admin = adminRepository.findByUsername(request.getUsername());
            if (admin.isPresent()) {
                String token = jwtUtil.generateToken(admin.get().getUsername(), "ADMIN", admin.get().getId());
                return new AuthResponse(token, "ADMIN", admin.get().getId(), "Admin login successful");
            }

            // Check if user exists in user table
            Optional<User> user = userRepository.findByUsername(request.getUsername());
            if (user.isPresent()) {
                String token = jwtUtil.generateToken(user.get().getUsername(), "USER", user.get().getId());
                return new AuthResponse(token, "USER", user.get().getId(), "User login successful");
            }

            throw new RuntimeException("User not found");

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public UserResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return userResponse;
    }

    public UserResponse updateInfomation(Long userId, UpdateInformationRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setBday(request.getBday());
        userRepository.save(user);
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return userResponse;
    }
    public Map<String, Object> AdminGetUser(UserFilter filter, int page, int size) {
        String baseSql = """
             SELECT 
                 c.fname,
                 c.lname,
                 c.bday,
                 c.status,
                 c.address,
                 c.email,
                 c.phone
            FROM customer c
             WHERE 1=1
            """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (filter.getStatus() != null) {
            where.append(" AND status = :status");
            params.put("status", filter.getStatus());
        }

        String orderBy = " ORDER BY id ASC ";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = baseSql + where + orderBy + limitOffset;
        String countSql = "SELECT COUNT(*) FROM customer WHERE 1=1 " + where;

        Query query = entityManager.createNativeQuery(finalSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        // Set dynamic parameters
        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setParameter("limit", size);
        query.setParameter("offset", page * size);

        // Lấy kết quả và ánh xạ thủ công
        List<Object[]> rows = query.getResultList();
        List<UserResponse> users = new ArrayList<>();

        for (Object[] row : rows) {
            // Bảo vệ kiểu bday
            LocalDate bday = null;
            Object bdayObj = row[2];
            if (bdayObj instanceof java.sql.Date date) {
                bday = date.toLocalDate();
            } else if (bdayObj instanceof java.sql.Timestamp ts) {
                bday = ts.toLocalDateTime().toLocalDate();
            } else if (bdayObj != null) {
                throw new IllegalStateException("Unknown date type: " + bdayObj.getClass());
            }

            users.add(new UserResponse(
                    (String) row[0],         // fname
                    (String) row[1],         // lname
                    bday,                    // bday
                    (String) row[4],         // address
                    (String) row[5],         // email
                    (String) row[6],         // phone
                    row[3].toString()        // status
            ));
        }

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> result = new HashMap<>();
        result.put("content", users);
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }

    public ReceiverResponse createReceiver(ReceiverInfoRequest request, Long userId)
    {
      ReceiverInfo receiverInfo = new ReceiverInfo();
      receiverInfo.setName(request.getName());
      receiverInfo.setAddress(request.getAddress());
      receiverInfo.setPhone(request.getPhone());
      receiverInfo.setEmail(request.getEmail());
      User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("user not found with id"));
      receiverInfo.setUser(user);
      receiverInfoRepository.save(receiverInfo);

      ReceiverResponse response = modelMapper.map(receiverInfo, ReceiverResponse.class);
    return response;
    };

    public ReceiverResponse updateReceiver(ReceiverInfoRequest request, Long receiverId)
    {
        ReceiverInfo receiverInfo = receiverInfoRepository.findById(receiverId).orElseThrow(()-> new ResourceNotFoundException("receiver not found!"));
        receiverInfo.setName(request.getName());
        receiverInfo.setAddress(request.getAddress());
        receiverInfo.setPhone(request.getPhone());
        receiverInfo.setEmail(request.getEmail());
        receiverInfoRepository.save(receiverInfo);

        ReceiverResponse response = modelMapper.map(receiverInfo, ReceiverResponse.class);
        return response;
    }

    public List<ReceiverResponse> getListReceiver(Long userId){
        List<ReceiverInfo> receiverInfos = receiverInfoRepository.findAllByUserId(userId);
        return receiverInfos.stream()
                .map(receiverInfo -> modelMapper.map(receiverInfo, ReceiverResponse.class))
                .toList();
    }

}
