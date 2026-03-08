import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { CreditCard, CheckCircle, XCircle, Loader, ArrowLeft, Smartphone } from "lucide-react"
import { appointmentAPI, paymentAPI } from "../api/services"
import { useAuth } from "../context/AuthContext"
import { useTranslation } from "../hooks/useTranslation"

export default function CheckoutPage() {
  const { appointmentId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()

  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [processing, setProcessing] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [transactionId, setTransactionId] = useState(null)
  const [checkoutRequestId, setCheckoutRequestId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'failed', 'pending'
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/therapists')
      return
    }

    appointmentAPI.getOne(appointmentId)
      .then(res => {
        const apt = res.data.data.appointment
        setAppointment(apt)
        
        // Check if already paid
        if (apt.status === 'paid' || apt.status === 'confirmed' || apt.status === 'completed') {
          setPaymentStatus('success')
        }
      })
      .catch(() => {
        setError("Appointment not found")
      })
      .finally(() => setLoading(false))
  }, [appointmentId, isAuthenticated, navigate])

  const handleInitiatePayment = async () => {
    if (!phoneNumber) {
      setError("Please enter your M-Pesa phone number")
      return
    }

    const phoneRegex = /^(07|01|\+2547|\+2541|2547|2541)\d{8}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError("Please enter a valid Kenyan phone number")
      return
    }

    setError("")
    setProcessing(true)

    try {
      const response = await paymentAPI.initiate({
        appointmentId,
        phoneNumber
      })

      const { transactionId: txId, checkoutRequestId: reqId, customerMessage } = response.data.data

      setTransactionId(txId)
      setCheckoutRequestId(reqId)
      setPaymentStatus('pending')
      
      // Show customer message
      console.log(customerMessage)

      // Auto-simulate payment after 3 seconds (MOCK)
      setTimeout(() => {
        simulatePaymentCompletion(reqId)
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment")
      setProcessing(false)
    }
  }

  const simulatePaymentCompletion = async (reqId) => {
    try {
      const response = await paymentAPI.simulate(reqId)
      
      if (response.data.data.success) {
        setPaymentStatus('success')
        setProcessing(false)
        
        // Refresh appointment data
        const aptRes = await appointmentAPI.getOne(appointmentId)
        setAppointment(aptRes.data.data.appointment)
      } else {
        setPaymentStatus('failed')
        setError(response.data.data.message || 'Payment failed')
        setProcessing(false)
      }
    } catch (err) {
      setPaymentStatus('failed')
      setError('Payment processing failed')
      setProcessing(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!transactionId) return

    setCheckingStatus(true)
    try {
      const response = await paymentAPI.getTransaction(transactionId)
      const tx = response.data.data.transaction

      if (tx.status === 'completed') {
        setPaymentStatus('success')
        setProcessing(false)
      } else if (tx.status === 'failed') {
        setPaymentStatus('failed')
        setError('Payment failed')
        setProcessing(false)
      }
    } catch (err) {
      console.error('Failed to check status:', err)
    } finally {
      setCheckingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--base-bg)" }}>
        <Loader className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--base-bg)" }}>
        <p className="text-gray-500">{error || "Appointment not found"}</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm font-medium" style={{ color: "var(--primary)" }}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  const provider = appointment.therapist || appointment.spiritualLeader
  const sessionPrice = provider?.sessionPrice || 0
  const platformCommission = (sessionPrice * 20) / 100
  const therapistAmount = sessionPrice - platformCommission

  // Success View
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--base-bg)" }}>
        <div className="bg-base-bg rounded-3xl p-12 text-center max-w-md shadow-xl border" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--base-text)" }}>
            {t('payment.success') || 'Payment Successful!'}
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            Your appointment has been confirmed
          </p>
          <p className="text-2xl font-bold mb-6" style={{ color: "var(--primary)" }}>
            ETB {sessionPrice.toLocaleString()}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className="font-semibold" style={{ color: "var(--base-text)" }}>{provider?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold" style={{ color: "var(--base-text)" }}>
                {new Date(appointment.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold" style={{ color: "var(--base-text)" }}>{appointment.time}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-inverse" 
              style={{ background: "var(--primary)" }}>
              View Dashboard
            </button>
            <button 
              onClick={() => navigate("/therapists")} 
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border" 
              style={{ borderColor: "#D4DBC8", color: "var(--primary)" }}>
              Book Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Failed View
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--base-bg)" }}>
        <div className="bg-base-bg rounded-3xl p-12 text-center max-w-md shadow-xl border border-red-200">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-red-100">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            {t('payment.failed') || 'Payment Failed'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => {
                setPaymentStatus(null)
                setError("")
                setPhoneNumber("")
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700">
              Try Again
            </button>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Pending Payment View
  if (paymentStatus === 'pending' || processing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--base-bg)" }}>
        <div className="bg-base-bg rounded-3xl p-12 text-center max-w-md shadow-xl border" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
            <Smartphone className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--base-text)" }}>
            {t('payment.pending') || 'Waiting for Payment'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Please check your phone and enter your M-Pesa PIN to complete the payment
          </p>
          
          <div className="relative mb-6">
            <div className="flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            This may take a few seconds...
          </p>

          <button 
            onClick={checkPaymentStatus}
            disabled={checkingStatus}
            className="px-4 py-2 text-sm font-medium rounded-lg border" 
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            {checkingStatus ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </div>
    )
  }

  // Checkout Form
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--base-bg)" }}>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity" 
          style={{ color: "var(--primary)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid gap-6">
          {/* Payment Summary Card */}
          <div className="bg-base-bg rounded-2xl border p-6" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6" style={{ color: "var(--primary)" }} />
              <h2 className="text-xl font-bold" style={{ color: "var(--base-text)" }}>
                {t('payment.title') || 'Complete Payment'}
              </h2>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Session with</p>
                  <p className="font-semibold" style={{ color: "var(--base-text)" }}>{provider?.name}</p>
                  <p className="text-xs text-gray-400">{provider?.specialization || provider?.religion}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold" style={{ color: "var(--base-text)" }}>
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">{appointment.time}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Session Price</span>
                <span className="font-medium" style={{ color: "var(--base-text)" }}>ETB {sessionPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Platform Fee (20%)</span>
                <span>- ETB {platformCommission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Therapist Receives</span>
                <span>ETB {therapistAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t" style={{ borderColor: "#E5E7EB", color: "var(--primary)" }}>
                <span>Total Amount</span>
                <span>ETB {sessionPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* M-Pesa Payment Card */}
          <div className="bg-base-bg rounded-2xl border p-6" style={{ borderColor: "color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)" }}>
            <div className="flex items-center gap-3 mb-6">
              <img src="/mpesa.png" alt="M-Pesa" className="h-8" />
              <h3 className="text-lg font-bold" style={{ color: "var(--base-text)" }}>
                Pay with M-Pesa
              </h3>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--base-text)" }}>
                  M-Pesa Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    borderColor: "#D4DBC8", 
                    color: "var(--base-text)",
                    backgroundColor: "var(--base-bg)"
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the phone number registered with M-Pesa
                </p>
              </div>

              <button 
                onClick={handleInitiatePayment}
                disabled={processing || !phoneNumber}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #00AB44, #00CC53)" }}>
                {processing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" /> Pay ETB {sessionPrice.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                You will receive a prompt on your phone to complete the payment
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <CheckCircle className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <span>Secure payment powered by M-Pesa</span>
          </div>
        </div>
      </div>
    </div>
  )
}
