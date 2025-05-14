function Header() {
    return (
        <header className="w-full bg-card border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* <div className="text-2xl">📊🍿</div>
                        <span className="text-lg font-bold tracking-tight">BingeScore</span> */}
                    <img src="/public/logo-small.png" />
                </div>
                {/* <motion.div className="flex items-center space-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <img src="/public/logo-small.png" alt="BingeScore Logo" className="w-8 h-8" />
                    <span className="text-lg font-bold tracking-tight">BingeScore</span>
                </motion.div> */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors duration-200">
                        Home
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors duration-200">
                        Preferiti
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors duration-200">
                        Contatti
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
