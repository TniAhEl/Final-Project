import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderAuth from '../../components/Header/HeaderAuth';
import Footer from '../../components/Footer/Footer';
import ProductLayout from '../../layouts/ProductLayout';

import { getProductById } from '../../api/productService';

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {
        // Nếu trả về object sản phẩm trực tiếp
        if (data && data.name) {
          setProduct(data);
        } else if (data && typeof data === 'object' && data.data && data.data.name) {
          // Nếu trả về {message, data: {...}}
          setProduct(data.data);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product || typeof product !== 'object' || !product.name) return <div>Product not found or invalid data.</div>;

  // Helper render
  const InfoRow = ({ label, value }) =>
    value !== undefined && value !== null && value !== '' ? (
      <div className="flex mb-2"><span className="w-40 font-medium text-gray-600">{label}:</span> <span className="flex-1">{value}</span></div>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderAuth />
      <ProductLayout />
      <div className="flex-1 max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6">
        {/* Configuration */}
        <div className="bg-white rounded shadow p-6 mb-4 w-6xl      ">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="Operating System" value={product.os} />
              <InfoRow label="CPU" value={product.cpu} />
              <InfoRow label="CPU Speed" value={product.cpuSpeed ? `${product.cpuSpeed} GHz`:undefined} />
              <InfoRow label="GPU" value={product.gpu} />
              <InfoRow label="RAM" value={product.ramOptions?.join(', ')} />
              <InfoRow label="Storage" value={product.storage} />
              <InfoRow label="Battery Capacity" value={product.batteryCapacity ? `${product.batteryCapacity} mAh` : undefined} />
              <InfoRow label="Battery Type" value={product.batteryType} />
              <InfoRow label="Battery Tech" value={product.batteryTech} />
              <InfoRow label="Charge Support" value={product.chargeSupport} />
              <InfoRow label="Charge Port" value={product.chargePort} />
            </div>
          </div>
        </div>
        {/* Camera & Screen */}
        <div className="bg-white rounded shadow p-6 mb-4 w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Camera & Screen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="Screen Size" value={product.screenDimension} />
              <InfoRow label="Screen Resolution" value={product.screenResolution} />
              <InfoRow label="Screen Tech" value={product.screenTech} />
              <InfoRow label="Screen Touch" value={product.screenTouch} />
              <InfoRow label="Max Brightness" value={product.maxBrightness} />
            </div>
            <div>
              <InfoRow label="Front Camera" value={product.frontCamera} />
              <InfoRow label="Back Camera" value={product.backCamera} />
              <InfoRow label="Back Camera Tech" value={product.backCameraTech} />
              <InfoRow label="Back Camera Record" value={product.backCameraRecord} />
              <InfoRow label="Flash" value={product.flash ? 'Yes' : 'No'} />
            </div>
          </div>
        </div>
        {/* Design & Material */}
        <div className="bg-white rounded shadow p-6 mb-4  w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Design & Material</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="Design" value={product.design} />
              <InfoRow label="Material" value={product.material} />
              <InfoRow label="Dimension" value={product.dimension} />
              <InfoRow label="Weight" value={product.weight} />
            </div>
          </div>
        </div>
        {/* Connection */}
        <div className="bg-white rounded shadow p-6 mb-4 w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Connection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="Earphone Port" value={product.earphonePort} />
              <InfoRow label="Another Port" value={product.anotherPort} />
              <InfoRow label="Bluetooth" value={product.bluetooth} />
              <InfoRow label="WiFi" value={product.wifi} />
              <InfoRow label="GPS" value={product.gps} />
              <InfoRow label="Mobile Network" value={product.mobileNetwork} />
              <InfoRow label="SIM" value={product.sim} />
            </div>
          </div>
        </div>
        {/* Utilities & Warranty */}
        <div className="bg-white rounded shadow p-6 mb-4 w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Utilities</h2>
          <InfoRow label="Music Utility" value={product.musicUtil} />
          <InfoRow label="Movie Utility" value={product.movieUtil} />
          <InfoRow label="Record Utility" value={product.recordUtil} />
          <InfoRow label="Resistance Utility" value={product.resistanceUtil} />
          <InfoRow label="Special Utility" value={product.specialUtil} />
        </div>
        {/* Warranty */}
        {product.warranty && (
          <div className="bg-white rounded shadow p-6 mb-4 w-6xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Warranty</h2>
            <InfoRow label="Duration (months)" value={product.warranty.duration} />
            <InfoRow label="Condition" value={product.warranty.condition} />
            <InfoRow label="Exception" value={product.warranty.exception} />
            <InfoRow label="Note" value={product.warranty.note} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Details;
