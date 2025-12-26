"use client";
export default function ToolComingSoon({ toolName, description, icon: Icon, color }) {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
            <div className="text-center px-6">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">{toolName}</h1>
                <p className="text-muted-foreground text-lg mb-8">{description}</p>
                <div className="inline-block px-6 py-3 rounded-lg bg-primary/10 text-primary font-medium">
                    🚧 Coming Soon
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                    This tool is currently under development
                </p>
            </div>
        </div>
    );
}
