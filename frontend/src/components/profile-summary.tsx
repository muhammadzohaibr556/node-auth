import { ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/lib/schemas'

export function ProfileSummary({ user }: { user: User }) {
    return (
        <aside className='profile-aside'>
            <Card className='identity-card'>
                <CardContent>
                    <div className='avatar'>
                        {user.firstname.charAt(0)}
                        {user.lastname.charAt(0)}
                    </div>
                    <h2>
                        {user.firstname} {user.lastname}
                    </h2>
                    <p>@{user.username}</p>
                    <div className='identity-divider' />
                    <div className='identity-detail'>
                        <span>Account email</span>
                        <strong>{user.email}</strong>
                    </div>
                    {user.createdAt && (
                        <div className='identity-detail'>
                            <span>Member since</span>
                            <strong>
                                {new Date(
                                    user.createdAt,
                                ).toLocaleDateString(
                                    undefined,
                                    {
                                        month: 'long',
                                        year: 'numeric',
                                    },
                                )}
                            </strong>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className='session-note'>
                <ShieldCheck size={21} />
                <div>
                    <h3>You’re in control</h3>
                    <p>
                        Your session stays in this browser tab.
                        Sign out when you’re finished on a
                        shared device.
                    </p>
                </div>
            </div>
        </aside>
    )
}
