"use client"
import Header from "@/components/header";


export default function Home() {
    return (
        <>
            <Header />

            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">Bem-vindo ao SpendWise</h1>
                    <p className="text-lg mb-6 text-gray-900">Gerencie suas finanças de forma inteligente.</p>
                    <div className="space-x-4">
                        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Login
                        </a>
                        <a href="/dashboard" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                            Acessar Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
