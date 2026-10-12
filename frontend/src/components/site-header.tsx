import { Leaf, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/schemas'

export function SiteHeader({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
    return (
        <header className='site-header'>
            <a className='brand' href='/' aria-label='Account home'>
                <span className='brand-icon'>
                    <Leaf size={20} />
                </span>
                account<span className='brand-dot'>.</span>
            </a>
            <div className='header-right'>
                {user ? (
                    <>
                        <span className='header-username'>
                            @{user.username}
                        </span>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={onSignOut}
                        >
                            <LogOut size={14} /> Sign out
                        </Button>
                    </>
                ) : (
                    <span className='header-note'>
                        <ShieldCheck size={15} /> A little space, just
                        for you
                    </span>
                )}
            </div>
        </header>
    )
}
