import { UserRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountForm, type AccountFormProps } from '@/components/account-form'
import { ProfileSummary } from '@/components/profile-summary'
import type { User } from '@/lib/schemas'

export function ProfilePage({ user, onSubmit }: { user: User; onSubmit: AccountFormProps['onSubmit'] }) {
    return (
        <main className='profile-page'>
            <div className='page-eyebrow'>
                <span /> YOUR ACCOUNT
            </div>
            <div className='profile-heading'>
                <div>
                    <h1>Make yourself at home, {user.firstname}.</h1>
                    <p>
                        Your details, all in one place. Keep them up to
                        date.
                    </p>
                </div>
                <span className='session-badge'>
                    <span /> Signed in
                </span>
            </div>
            <div className='profile-grid'>
                <Card className='profile-card'>
                    <CardHeader>
                        <div className='section-icon'>
                            <UserRound size={20} />
                        </div>
                        <CardTitle>Personal information</CardTitle>
                        <CardDescription>
                            This is how we know you. You can update
                            these details anytime.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AccountForm
                            mode='profile'
                            user={user}
                            onSubmit={onSubmit}
                        />
                    </CardContent>
                </Card>
                <ProfileSummary user={user} />
            </div>
        </main>
    )
}
