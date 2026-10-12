import { useState, type FormEvent, type ComponentProps } from 'react'
import { Check, Info, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ApiError } from '@/lib/api'
import { profileSchema, signinSchema, signupSchema, type User, type ProfileInput, type SigninInput, type SignupInput } from '@/lib/schemas'

export type AccountFormProps = {
  mode: 'signin' | 'signup' | 'profile'
  user?: User
  onSubmit: (values: ProfileInput | SigninInput | SignupInput) => Promise<void>
}

export function AccountForm({ mode, user, onSubmit }: AccountFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setSaved(false)
    const form = event.currentTarget
    const schema = mode === 'signup' ? signupSchema : mode === 'signin' ? signinSchema : profileSchema
    const result = schema.safeParse(Object.fromEntries(new FormData(form)))
    if (!result.success) {
      const fields: Record<string, string> = {}
      for (const issue of result.error.issues) fields[String(issue.path[0])] ??= issue.message
      setErrors(fields)
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(fields)[0]}"]`)?.focus()
      return
    }
    setErrors({})
    setBusy(true)
    try {
      await onSubmit(result.data)
      if (mode === 'profile') setSaved(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      if (error instanceof ApiError) setErrors(error.fields)
    } finally {
      setBusy(false)
    }
  }

  function field(name: string, label: string, props: ComponentProps<typeof Input> = {}) {
    return <div className="field">
      <Label htmlFor={name}>{label}</Label>
      <Input required id={name} name={name} aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined} {...props} />
      {errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>}
    </div>
  }

  return <form onSubmit={submit} noValidate onChange={() => { setSaved(false); setMessage('') }}>
    <fieldset disabled={busy} className="form-fields">
      {mode !== 'signin' && <>
        <div className="name-fields">
          {field('firstname', 'First name', { autoComplete: 'given-name', placeholder: 'Alex', defaultValue: user?.firstname, maxLength: 50 })}
          {field('lastname', 'Last name', { autoComplete: 'family-name', placeholder: 'Morgan', defaultValue: user?.lastname, maxLength: 50 })}
        </div>
        {field('email', 'Email address', { type: 'email', autoComplete: 'email', placeholder: 'alex@example.com', defaultValue: user?.email })}
        {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', placeholder: '+1 555 123 4567', defaultValue: user?.phone })}
      </>}
      {mode !== 'profile' && <>
        {field('username', 'Username', { autoComplete: 'username', placeholder: mode === 'signin' ? '' : 'Your username', autoCapitalize: 'none', spellCheck: false })}
        <div className="password-field">
          {field('password', 'Password', { type: showPassword ? 'text' : 'password', autoComplete: mode === 'signin' ? 'current-password' : 'new-password', placeholder: mode === 'signin' ? '' : 'At least 8 characters' })}
          <Button type="button" variant="ghost" size="icon" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </Button>
        </div>
        {mode === 'signup' && field('confirmPassword', 'Confirm password', { type: showPassword ? 'text' : 'password', autoComplete: 'new-password', placeholder: 'Re-enter your password' })}
      </>}
      {mode === 'signin' && <>
        <details className="recovery-details"><summary className="text-link">Forgot password</summary><p>Password recovery is not available yet. Contact your administrator for help accessing your account.</p></details>
        <div className="remember-device" title="Persistent device sessions are not supported yet."><input type="checkbox" id="remember-device" disabled /><Label htmlFor="remember-device">Remember this device</Label><Info size={16} aria-label="Not available yet" /></div>
      </>}
      {message && <Alert variant="destructive"><AlertDescription>{message}</AlertDescription></Alert>}
      {saved && <p className="saved-message" role="status"><Check size={16} /> Your profile has been updated.</p>}
      <Button className="submit-button" type="submit" disabled={busy}>
        {busy ? <><LoaderCircle className="animate-spin" /> {mode === 'profile' ? 'Saving changes…' : 'One moment…'}</>
          : <>{mode === 'signin' ? 'Continue' : mode === 'signup' ? 'Create account' : 'Save changes'}</>}
      </Button>
    </fieldset>
  </form>
}
