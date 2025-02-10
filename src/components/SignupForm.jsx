// SignupForm.jsx
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // Genereer tijdelijk wachtwoord
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Maak Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        tempPassword
      );

      // Sla gebruikersdata op
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        status: 'pending',
        tempPassword: tempPassword,
        createdAt: new Date().toISOString()
      });

      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-semibold mb-4">Bedankt voor je registratie!</h3>
        <p className="text-gray-600">
          Je account wordt aangemaakt en moet nog worden goedgekeurd.
          Je ontvangt een bevestigingsmail zodra dit is gebeurd.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Voornaam *</label>
        <input
          type="text"
          required
          value={formData.firstName}
          onChange={e => setFormData({...formData, firstName: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Achternaam *</label>
        <input
          type="text"
          required
          value={formData.lastName}
          onChange={e => setFormData({...formData, lastName: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bedrijfsnaam</label>
        <input
          type="text"
          value={formData.company}
          onChange={e => setFormData({...formData, company: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-primary-600 text-white p-2 rounded hover:bg-primary-700 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Bezig...' : 'Account aanmaken'}
      </button>
    </form>
  );
}