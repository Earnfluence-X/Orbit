import { useStore } from '@/lib/store';
import { OrbitShell } from '@/components/orbit/OrbitShell';
import { SetupWizard } from '@/components/orbit/SetupWizard';

export default function App() {
  const isFirstTime = useStore((state) => state.isFirstTime);

  return (
    <>
      {isFirstTime && <SetupWizard />}
      <OrbitShell />
    </>
  );
}
