import Image from "next/image";

type HeaderProps = {
    name: string;
    balance: number
}

export function Header({ name }: HeaderProps) {
    return (
        <div className="flex items-center justify-between p-12 border-b border-[#1F2937] w-full">
            <div className="uppercase font-bold">
                <p className="text-[12px] text-[#8F8389]">account overview</p>
                <h1 className="text-[24px] text-white">Welcome back, {name}</h1>
            </div>

            <div className="flex items-end">
                <div className="flex items-center bg-[#161618] rounded-full h-[54px] w-[256px] border border-[#1F2937]">
                    <span className="pl-5">
                        <Image
                            src='/search-icon.svg'
                            width={15}
                            height={15}
                            alt='search icon'
                        />
                    </span>
                    <input
                        type="search"
                        name="assets"
                        id="assets"
                        placeholder="search assets..."
                        className="bg-transparent text-[#6B7280] placeholder-[#6B7280] w-full outline-none border-none p-2" />
                </div>
                <div className="flex items-center pl-15 gap-8 h-[54px] w-[200px]">
                    <a href="">
                        <Image
                            src='/theme-icon.svg'
                            width={22}
                            height={22}
                            alt='search icon'
                        />
                    </a>
                    <a href="">
                        <Image
                            src='/notification-icon.svg'
                            width={16}
                            height={20}
                            alt='search icon'
                        />
                    </a>
                    <div className="flex items-center rounded-full bg-[#374151] w-[40px] h-[40px]">
                        <a href="" className="pl-[11px]">
                            <Image
                                src='/user-icon.svg'
                                width={16}
                                height={20}
                                alt='search icon'
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}