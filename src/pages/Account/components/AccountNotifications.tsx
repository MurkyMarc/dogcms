import { NotificationsForm } from "../../../components/forms/AccountNotifications";
import { Separator } from "../../../components/ui/separator";

export default function SettingsNotificationsPage() {
    return (
        <div className="flex-1 lg:max-w-2xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure how you receive notifications.
                    </p>
                </div>
                <Separator />
                <NotificationsForm />
            </div>
        </div>
    )
}