import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const PWAInstallModal = ({ show }: { show: boolean }) => {
  return show ? (
    <Dialog>
      <DialogTrigger>Install PWA</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Our PWA</DialogTitle>
          <DialogDescription>
            Follow these steps to install our PWA:
            <ul>
              <li>Open your browser's settings.</li>
              <li>Tap on "Add to Home Screen".</li>
              <li>Follow the prompts to complete the installation.</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : null;
};
export default PWAInstallModal;
