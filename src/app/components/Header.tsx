type HeaderProps = {
    description?: string;
    title: string;
    name?: string;
}

export function Header({ description, title, name }: HeaderProps) {
    return (
        <div className="flex items-center justify-between px-12 py-4 border-b border-[#1F2937] w-full">
            <div className="uppercase font-bold">
                <div className="text-[12px] text-[#8F8389]">
                    {
                        description !== undefined
                        && <p>{description}</p>
                    }
                </div>
                <div className="text-[24px] text-white">
                    {
                        name !== undefined
                        ? <h1>{title} {name}</h1>
                        : <h1>{title}</h1>
                    }
                </div>
            </div>
        </div>
    );
}