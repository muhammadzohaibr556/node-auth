import { Button } from '@/components/ui/button'

export function SocialSignIn() {
    return (
        <div
            className='social-signin'
            aria-describedby='social-note'
        >
            <div className='or-divider'>
                <span>or</span>
            </div>
            <div className='social-buttons'>
                <Button variant='outline' disabled>
                    <span
                        className='google-mark'
                        aria-hidden='true'
                    >
                        G
                    </span>
                    Sign in with Google
                </Button>
                <Button variant='outline' disabled>
                    <span
                        className='xero-mark'
                        aria-hidden='true'
                    >
                        xero
                    </span>
                    Sign in with Xero
                </Button>
                <Button
                    variant='outline'
                    disabled
                    className='intuit-button'
                >
                    Sign in with Intuit
                </Button>
            </div>
            <p
                id='social-note'
                className='availability-note'
            >
                Social sign-in is not connected yet.
            </p>
        </div>
    )
}
