import { MenuButton } from "../pages/Dashboard/components/MenuButton";
import BackButton from "./ui/icons/BackButton";

type TitleNavProps = {
    title?: string;
    backButton?: boolean;
    menuButton?: boolean;
}

export default function TitleNav({ title = "", backButton = true, menuButton = true }: TitleNavProps) {
    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <div className="flex items-center justify-between">
                    <div className="ml-2 flex items-center">
                        {menuButton && <MenuButton className="mr-4" />}
                        <h3 className="text-lg font-medium">{title}</h3>
                    </div>
                    {backButton && <BackButton />}
                </div>
            </div>
        </div>
    )
}
