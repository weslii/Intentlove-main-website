import { createContext, useContext, useState, ReactNode } from 'react';

interface WhatsAppContextType {
  showWhatsAppModal: boolean;
  setShowWhatsAppModal: (show: boolean) => void;
  whatsappForm: {
    name: string;
    message: string;
  };
  setWhatsappForm: (form: { name: string; message: string } | ((prev: { name: string; message: string }) => { name: string; message: string })) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider = ({ children }: { children: ReactNode }) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappForm, setWhatsappForm] = useState({
    name: "",
    message: "",
  });

  return (
    <WhatsAppContext.Provider value={{
      showWhatsAppModal,
      setShowWhatsAppModal,
      whatsappForm,
      setWhatsappForm
    }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};
