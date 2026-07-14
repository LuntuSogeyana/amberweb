"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading'); // 'loading' | 'paid' | 'error'

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (data.paid) {
          clearCart();
          setStatus('paid');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
      {status === 'loading' && (
        <>
          <Loader2 size={40} className="animate-spin text-neutral-400" />
          <h2 className="text-2xl font-light text-neutral-500 dark:text-neutral-400">Confirming your payment…</h2>
        </>
      )}

      {status === 'paid' && (
        <>
          <CheckCircle2 size={48} className="text-emerald-600" />
          <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100">Thank you for your order!</h2>
          <p className="text-neutral-500 dark:text-neutral-400">A confirmation has been sent to your email.</p>
          <Link href="/shop" className="text-indigo-550 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline underline-offset-4">
            Continue Shopping
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={48} className="text-red-600" />
          <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100">We couldn&apos;t confirm this payment</h2>
          <p className="text-neutral-500 dark:text-neutral-400">If you were charged, please contact support.</p>
          <Link href="/cart" className="text-indigo-550 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline underline-offset-4">
            Back to Cart
          </Link>
        </>
      )}
    </div>
  );
}