import { useEffect, useState } from 'react'
import { AuthPage } from '@/components/auth-page'
import { ProfilePage } from '@/components/profile-page'
import { ProfileLoading } from '@/components/profile-loading'
import { SiteHeader } from '@/components/site-header'
import type { AccountFormProps } from '@/components/account-form'
import { ApiError, request } from '@/lib/api'
import { authResponseSchema, profileResponseSchema, type User } from '@/lib/schemas'

function storedToken() {
    try {
        return sessionStorage.getItem('account-token') ?? ''
    } catch {
        return ''
    }
}

export default function App() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [token, setToken] = useState(storedToken)
    const [user, setUser] = useState<User | null>(null)
    const [notice, setNotice] = useState('')
    const [loadError, setLoadError] = useState('')
    const [attempt, setAttempt] = useState(0)

    function saveToken(value: string) {
        setToken(value)
        // Storage may be disabled; the current in-memory session still works.
        try {
            if (value) sessionStorage.setItem('account-token', value)
            else sessionStorage.removeItem('account-token')
        } catch {
            /* Keep the session in memory. */
        }
    }

    function signout(message = '') {
        saveToken('')
        setUser(null)
        setMode('signin')
        setNotice(message)
        setLoadError('')
    }

    useEffect(() => {
        if (!token || user) return
        const controller = new AbortController()
        setLoadError('')
        request('/users/me', profileResponseSchema, {
            token,
            signal: controller.signal,
        })
            .then((result) => setUser(result.data.user))
            .catch((error: unknown) => {
                if (controller.signal.aborted) return
                if (error instanceof ApiError && error.status === 401)
                    signout('Your session has expired. Please sign in again.')
                else
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Unable to load your profile.',
                    )
            })
        return () => controller.abort()
    }, [token, user, attempt])

    useEffect(() => {
        document.title = `${user ? 'Your profile' : mode === 'signup' ? 'Create account' : 'Sign in'} — Account`
    }, [user, mode])

    const authenticate: AccountFormProps['onSubmit'] = async (values) => {
        const result = await request(`/auth/${mode}`, authResponseSchema, {
            method: 'POST', body: values,
        })
        setUser(result.data.user)
        saveToken(result.data.token)
        setNotice('')
    }

    const updateProfile: AccountFormProps['onSubmit'] = async (values) => {
        try {
            const result = await request('/users/me', profileResponseSchema, {
                method: 'PATCH', body: values, token,
            })
            setUser(result.data.user)
        } catch (error) {
            if (error instanceof ApiError && error.status === 401)
                signout('Your session has expired. Please sign in again.')
            throw error
        }
    }

    return (
        <div className={`app-shell ${!token && !user ? 'auth-shell' : ''}`}>
            {(token || user) && <SiteHeader user={user} onSignOut={() => signout()} />}
            {token && !user ? (
                <ProfileLoading error={loadError} onRetry={() => setAttempt(attempt + 1)} onSignOut={() => signout()} />
            ) : user ? (
                <ProfilePage user={user} onSubmit={updateProfile} />
            ) : (
                <AuthPage mode={mode} notice={notice} onSubmit={authenticate}
                    onModeChange={(nextMode) => { setMode(nextMode); setNotice('') }} />
            )}
            <footer className='site-footer'>
                <span>{!token && !user ? 'Gusto' : 'Account'} © {new Date().getFullYear()}</span>
                <span>Account access, made simple.</span>
            </footer>
        </div>
    )
}
