const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.environment = process.env.MPESA_ENV || 'sandbox';
    this.baseURL = this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    this.callbackURL = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/payments/callback';
  }

  // Generate OAuth token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      const response = await axios.get(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Get current timestamp in the required format
  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Format phone number to M-Pesa format (254XXXXXXXXX)
  formatPhoneNumber(phone) {
    let cleanedPhone = phone.replace(/\s+/g, '').replace(/\+/g, '');
    
    // If starts with 0, replace with 254
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '254' + cleanedPhone.substring(1);
    }
    
    // If doesn't start with 254, add it
    if (!cleanedPhone.startsWith('254')) {
      cleanedPhone = '254' + cleanedPhone;
    }
    
    return cleanedPhone;
  }

  // Initiate STK Push payment (MOCK IMPLEMENTATION)
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      // MOCK: Simulate M-Pesa STK Push without calling real API
      console.log('🔔 [MOCK] M-Pesa STK Push initiated:', {
        phoneNumber,
        amount,
        accountReference,
        transactionDesc
      });

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Generate mock checkout request ID
      const mockCheckoutRequestId = `ws_CO_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const mockMerchantRequestId = `${Math.random().toString(36).substr(2, 20)}`;

      // Simulate API response
      return {
        success: true,
        checkoutRequestId: mockCheckoutRequestId,
        merchantRequestId: mockMerchantRequestId,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing'
      };
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error.message);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  // Query STK Push transaction status
  async querySTKPushStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc
      };
    } catch (error) {
      console.error('M-Pesa Query Error:', error.response?.data || error.message);
      throw new Error('Failed to query M-Pesa transaction status');
    }
  }

  // Simulate successful payment (MOCK - replaces callback processing)
  async simulatePaymentSuccess(checkoutRequestId) {
    try {
      console.log('💰 [MOCK] Simulating payment success for:', checkoutRequestId);

      // Find transaction by checkoutRequestId
      const transaction = await prisma.transaction.findUnique({
        where: { mpesaCheckoutId: checkoutRequestId },
        include: { appointment: true }
      });

      if (!transaction) {
        console.error('Transaction not found for CheckoutRequestID:', checkoutRequestId);
        throw new Error('Transaction not found');
      }

      // Generate mock receipt number
      const mockReceiptNumber = `QAR${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate commission
      const platformCommission = (transaction.amount * transaction.platformCommissionRate) / 100;
      const therapistAmount = transaction.amount - platformCommission;

      console.log('💸 Commission breakdown:', {
        totalAmount: transaction.amount,
        platformCommission,
        therapistAmount,
        commissionRate: `${transaction.platformCommissionRate}%`
      });

      // Update transaction
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          mpesaReceiptNumber: mockReceiptNumber,
          platformCommission,
          therapistAmount
        }
      });

      // Update appointment status to paid
      await prisma.appointment.update({
        where: { id: transaction.appointmentId },
        data: { status: 'paid' }
      });

      return {
        success: true,
        message: 'Payment processed successfully',
        mpesaReceiptNumber: mockReceiptNumber,
        amount: transaction.amount,
        platformCommission,
        therapistAmount
      };
    } catch (error) {
      console.error('Payment Simulation Error:', error);
      throw error;
    }
  }

  // Process M-Pesa callback (webhook) - Real implementation for future use
  async processCallback(callbackData) {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;
      
      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc
      } = stkCallback;

      // Find transaction by checkoutRequestId
      const transaction = await prisma.transaction.findUnique({
        where: { mpesaCheckoutId: CheckoutRequestID },
        include: { appointment: true }
      });

      if (!transaction) {
        console.error('Transaction not found for CheckoutRequestID:', CheckoutRequestID);
        return { success: false, message: 'Transaction not found' };
      }

      // ResultCode 0 means success
      if (ResultCode === 0) {
        // Extract callback metadata
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
        const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        const amountPaid = callbackMetadata.find(item => item.Name === 'Amount')?.Value;

        // Calculate commission
        const platformCommission = (transaction.amount * transaction.platformCommissionRate) / 100;
        const therapistAmount = transaction.amount - platformCommission;

        // Update transaction
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'completed',
            mpesaReceiptNumber,
            platformCommission,
            therapistAmount
          }
        });

        // Update appointment status to paid
        await prisma.appointment.update({
          where: { id: transaction.appointmentId },
          data: { status: 'paid' }
        });

        return {
          success: true,
          message: 'Payment processed successfully',
          mpesaReceiptNumber,
          amount: amountPaid
        };
      } else {
        // Payment failed
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'failed' }
        });

        return {
          success: false,
          message: ResultDesc || 'Payment failed',
          resultCode: ResultCode
        };
      }
    } catch (error) {
      console.error('Callback Processing Error:', error);
      throw error;
    }
  }

  // B2C - Pay therapist (future implementation)
  async payoutToTherapist(phoneNumber, amount, transactionId) {
    try {
      const accessToken = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const requestBody = {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment',
        Amount: Math.round(amount),
        PartyA: this.shortcode,
        PartyB: formattedPhone,
        Remarks: 'Therapist payout',
        QueueTimeOutURL: process.env.MPESA_TIMEOUT_URL,
        ResultURL: process.env.MPESA_RESULT_URL,
        Occasion: `Payout-${transactionId}`
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/b2c/v1/paymentrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode
      };
    } catch (error) {
      console.error('M-Pesa B2C Error:', error.response?.data || error.message);
      throw new Error('Failed to process therapist payout');
    }
  }
}

module.exports = new MpesaService();
