import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getOrderById, cancelOrder, downloadInvoice } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector(state => state.orders);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    if (orderId && orderId !== 'undefined') {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      // Refresh order details
      dispatch(getOrderById(orderId));
    } catch (error) {
      toast.error(error || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderId) {
      toast.error('Order ID is missing');
      return;
    }
    
    setInvoiceLoading(true);
    try {
      const result = await dispatch(downloadInvoice(orderId)).unwrap();
      
      // Create a temporary div with the invoice HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = result.html;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.minHeight = '297mm';
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);
      
      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`invoice-${result.orderNumber}.pdf`);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error || 'Failed to download invoice');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'returned':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'confirmed':
      case 'processing':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'shipped':
      case 'out_for_delivery':
        return <TruckIcon className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled':
      case 'returned':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = () => {
    return currentOrder && !['shipped', 'delivered', 'cancelled', 'returned'].includes(currentOrder.orderStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{currentOrder.orderNumber} - Caper Sports</title>
        <meta name="description" content={`View details for order ${currentOrder.orderNumber}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Orders
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Order #{currentOrder.orderNumber}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Placed on {formatDate(currentOrder.createdAt)}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.orderStatus)}`}>
                  {getStatusIcon(currentOrder.orderStatus)}
                  <span className="ml-2 capitalize">{currentOrder.orderStatus.replace('_', ' ')}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={handleDownloadInvoice}
                    disabled={invoiceLoading}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                    title="Download Invoice"
                  >
                    {invoiceLoading ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <PrinterIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  {canCancelOrder() && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h2>
                
                <div className="space-y-4">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Size: {item.size} • Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {item.sku}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Timeline
                </h2>
                
                <div className="space-y-4">
                  {currentOrder.orderStatusHistory?.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(history.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {history.status.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(history.timestamp)}
                        </p>
                        {history.note && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(currentOrder.orderStatus)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {currentOrder.orderStatus.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(currentOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">₹{currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {currentOrder.shippingFee === 0 ? 'Free' : `₹${currentOrder.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">₹{currentOrder.tax.toFixed(2)}</span>
                  </div>
                  {currentOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-600">-₹{currentOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">₹{currentOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">{currentOrder.shippingAddress.fullName}</p>
                  <p>{currentOrder.shippingAddress.addressLine1}</p>
                  {currentOrder.shippingAddress.addressLine2 && (
                    <p>{currentOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.pinCode}</p>
                  <p>{currentOrder.shippingAddress.country}</p>
                  
                  <div className="flex items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{currentOrder.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>{currentOrder.shippingAddress.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {currentOrder.paymentMethod === 'card' ? 'Credit/Debit Card' :
                     currentOrder.paymentMethod === 'upi' ? 'UPI' :
                     currentOrder.paymentMethod === 'netbanking' ? 'Net Banking' :
                     currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : currentOrder.paymentMethod}
                  </p>
                  <p className="mt-1">
                    Status: <span className={`font-medium ${currentOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {currentOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Customer Notes */}
              {currentOrder.customerNotes && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Order Notes
                  </h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {currentOrder.customerNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {cancelLoading && <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />}
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
