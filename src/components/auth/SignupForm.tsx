'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Alle velden zijn verplicht');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return false;
    }
    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens lang zijn');
      return false;
    }
    if (!email.includes('@')) {
      setError('Voer een geldig e-mailadres in');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/auth/verify-email');
    } catch (err: any) {
      let errorMessage = 'Er is een fout opgetreden bij het registreren';
      
      // Firebase-specifieke foutmeldingen
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Dit e-mailadres is al in gebruik';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Ongeldig e-mailadres';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Registratie is momenteel niet mogelijk';
          break;
        case 'auth/weak-password':
          errorMessage = 'Het wachtwoord is te zwak';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account aanmaken</CardTitle>
        <CardDescription>
          Maak een account aan om toegang te krijgen tot alle functies
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met registreren...
              </>
            ) : (
              'Registreren'
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Heb je al een account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push('/login')}
            >
              Log in
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
} 