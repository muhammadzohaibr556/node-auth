import { Alert, AlertDescription } from '@/components/ui/alert'
import { AccountForm, type AccountFormProps } from '@/components/account-form'
import { SocialSignIn } from '@/components/social-signin'

type AuthPageProps = {
    mode: 'signin' | 'signup'
    notice: string
    onModeChange: (mode: 'signin' | 'signup') => void
    onSubmit: AccountFormProps['onSubmit']
}

export function AuthPage({ mode, notice, onModeChange, onSubmit }: AuthPageProps) {
    return (
        <main
            className={`auth-layout ${mode === 'signup' ? 'signup-layout' : ''}`}
        >
            <div
                className='welcome-illustration'
                role='img'
                aria-label='Three people waving to each other on a staircase, surrounded by plants'
            >
                <img src='/images/login-reference.png' alt='' />
            </div>
            <section
                className='auth-panel'
                aria-labelledby='auth-title'
            >
                <div className='gusto-mark' aria-label='Gusto'>
                    gusto
                </div>
                <h1 id='auth-title'>
                    {mode === 'signin'
                        ? 'Sign In'
                        : 'Create your account'}
                </h1>
                {notice && (
                    <Alert className='session-alert'>
                        <AlertDescription>{notice}</AlertDescription>
                    </Alert>
                )}
                <AccountForm
                    key={mode}
                    mode={mode}
                    onSubmit={onSubmit}
                />
                {mode === 'signin' && (
                    <SocialSignIn />
                )}
                <div className='auth-links'>
                    <p>
                        {mode === 'signin'
                            ? 'New to Gusto?'
                            : 'Already have an account?'}{' '}
                        <button
                            className='text-link'
                            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                        >
                            {mode === 'signin'
                                ? 'Get Started'
                                : 'Sign In'}
                        </button>
                    </p>
                    <details className='help-details'>
                        <summary>
                            Need Help?{' '}
                            <span className='text-link'>
                                Visit our help center
                            </span>
                        </summary>
                        <p>
                            Sign in with the username you chose when
                            creating your account. For access issues,
                            contact your administrator. Password
                            recovery and social sign-in are not
                            available yet.
                        </p>
                    </details>
                </div>
            </section>
        </main>
    )
}
