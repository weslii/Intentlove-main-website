// Paystack integration for payment processing
// Documentation: https://paystack.com/docs/payments/accept-payments/

export type PaystackConfig = {
  publicKey: string;
  email: string;
  amount: number; // in kobo (multiply Naira amount by 100)
  reference?: string;
  metadata?: Record<string, any>;
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
};

export type PaystackResponse = {
  reference: string;
  status: string;
  transaction: string;
  message: string;
  redirecturl?: string;
};

// Initialize Paystack payment
export function initializePaystack(config: PaystackConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if PaystackPop is available
    if (typeof window === 'undefined' || !(window as any).PaystackPop) {
      // Load Paystack script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        // Once loaded, initialize payment
        initializePayment(config, resolve, reject);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Paystack script'));
      };
      document.body.appendChild(script);
    } else {
      // If already loaded, initialize payment
      initializePayment(config, resolve, reject);
    }
  });
}

// Helper function to initialize Paystack payment
function initializePayment(
  config: PaystackConfig,
  resolve: () => void,
  reject: (error: Error) => void
) {
  try {
    const handler = (window as any).PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference || generateReference(),
      metadata: config.metadata || {},
      callback: (response: PaystackResponse) => {
        if (config.callback) {
          config.callback(response);
        }
        resolve();
      },
      onClose: () => {
        if (config.onClose) {
          config.onClose();
        }
        reject(new Error('Payment window closed'));
      },
    });
    handler.openIframe();
  } catch (error) {
    reject(error instanceof Error ? error : new Error('Failed to initialize Paystack payment'));
  }
}

// Generate a unique reference for the transaction
function generateReference(): string {
  const timestamp = new Date().getTime().toString();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `ref-${timestamp}-${randomStr}`;
}

// Verify payment on the backend (this would typically be done server-side)
export async function verifyPayment(reference: string): Promise<boolean> {
  // In a real implementation, this would make a server-side call to verify the payment
  // For now, we'll just return true to simulate a successful verification
  console.log(`Verifying payment with reference: ${reference}`);
  return true;
}

// Get Paystack public key from environment variables
export function getPaystackPublicKey(): string {
  // In a real implementation, this would come from environment variables
  // For development, we'll use a placeholder
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key';
}