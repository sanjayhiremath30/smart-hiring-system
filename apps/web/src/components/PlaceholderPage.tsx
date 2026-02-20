export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-md">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                    <span className="text-4xl">✨</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
                <p className="text-slate-500 mb-8">This module is coming soon! Our engineers are working hard to bring you the best placement preparation experience.</p>
                <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all">
                    Go back to Dashboard
                </button>
            </div>
        </div>
    );
}
