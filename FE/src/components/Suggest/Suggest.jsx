import React from "react";

const suggestions = [
  "iphone 16", "iphone 16 pro", "iphone 16 pro max", "Samsung Galaxy Tab S9", "Lenovo Tab M11", "iphone 15", "iphone 15 plus", "samsung z flip 7", "tai nghe airpods",
  "airpods 4", "airpods 4 anc", "apple watch series 10", "apple watch series 9", "apple watch ultra 2", "asus", "laptop gaming", "macbook air", "macbook pro", "Mac Studio M4",
  "MacBook Air M4", "airtag", "loa jbl", "tai nghe sony", "loa marshall", "bàn phím gaming", "chuột logitech", "loa harman kardon", "đồng hồ g shock",
  "đồng hồ định vị trẻ em viettel", "samsung galaxy z series", "orient star", "đồng hồ thụy sỹ", "đồng hồ baby g", "macbook", "macbook pro m4", "samsung s25",
  "samsung s25 plus", "samsung galaxy s25 ultra", "iphone 16e", "iphone 14", "samsung galaxy z fold 7"
];

function Suggest() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Mọi người cũng tìm kiếm</h2>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-100 transition"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Suggest;
