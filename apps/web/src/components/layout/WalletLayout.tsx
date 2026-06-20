import Sidebar from './Sidebar';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <main className="ml-60 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}