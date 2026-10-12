import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileLoading({ error, onRetry, onSignOut }: { error: string; onRetry: () => void; onSignOut: () => void }) {
    return (
        <main className='loading-page'>
            <Card className='loading-card'>
                <CardHeader>
                    <CardTitle>
                        {error
                            ? 'Let’s try that again'
                            : 'Getting your space ready'}
                    </CardTitle>
                    <CardDescription>
                        {error || 'Loading your profile…'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className='loading-actions'>
                            <Button
                                onClick={onRetry}
                            >
                                Try again
                            </Button>
                            <Button
                                variant='outline'
                                onClick={onSignOut}
                            >
                                Back to sign in
                            </Button>
                        </div>
                    ) : (
                        <LoaderCircle
                            className='animate-spin'
                            aria-label='Loading profile'
                        />
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
