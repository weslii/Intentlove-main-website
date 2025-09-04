import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

export const GlobalWhatsAppModal = () => {
  const { showWhatsAppModal, setShowWhatsAppModal, whatsappForm, setWhatsappForm } = useWhatsApp();

  const handleWhatsAppInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWhatsappForm(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappForm.name.trim() || !whatsappForm.message.trim()) {
      return;
    }

    const phoneNumber = "09049763647";
    const encodedMessage = encodeURIComponent(
      `Hello! My name is ${whatsappForm.name.trim()}. ${whatsappForm.message.trim()}`
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setShowWhatsAppModal(false);
    setWhatsappForm({ name: "", message: "" });
  };

  return (
    <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            Send WhatsApp Message
          </DialogTitle>
          <DialogDescription>
            Send us a message on WhatsApp and we'll get back to you quickly!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={whatsappForm.name}
              onChange={handleWhatsAppInputChange}
              placeholder="Enter your name"
              required
              autoComplete="name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={whatsappForm.message}
              onChange={handleWhatsAppInputChange}
              placeholder="Tell us about your order or ask a question..."
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Send on WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowWhatsAppModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
