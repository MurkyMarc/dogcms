import { Separator } from "../../../components/ui/separator"
import { ProfileForm } from '../../../components/forms/ProfileForms'

export const AccountProfile = () => {
    return (
        <div className="flex-1 lg:max-w-2xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator />
                <ProfileForm />
            </div>
        </div>
    )
}
