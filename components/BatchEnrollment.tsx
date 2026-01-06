
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheck, FaXmark } from 'react-icons/fa6';

const branches = [
    {
        id: 'sambhaji-nagar',
        name: 'Sambhaji Nagar Branch',
        address: 'Sambhaji Nagar Road, Dhankwadi, near by Suyog Hospital, Pune 411043'
    },
    {
        id: 'balaji-nagar',
        name: 'Balaji Nagar Branch',
        address: 'Balaji Nagar, Dhankawade Patil Township, near by Siddhi Hospital, Pune 411043'
    }
];

export default function BatchEnrollment({ batchId, price, pricingType }: { batchId: string, price: string, pricingType: string }) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);
    const [utrNumber, setUtrNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Enrollment Status State
    const [enrollmentStatus, setEnrollmentStatus] = useState<{ enrolled: boolean, status: string | null } | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            if (!token || !batchId) {
                setCheckingStatus(false);
                return;
            }
            try {
                const res = await fetch(`/api/batches/${batchId}/enrollment`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setEnrollmentStatus(data);
                }
            } catch (error) {
                console.error("Status check failed", error);
            } finally {
                setCheckingStatus(false);
            }
        };
        checkStatus();
    }, [token, batchId, step]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);



    const handleSubmit = async () => {
        if (!token) {
            alert('Please login to enroll');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ batchId, branch: selectedBranch.id, utrNumber })
            });
            const data = await res.json();
            if (data.success) {
                setStep(4);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error enrolling');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEnrollClick = () => {
        if (!token) {
            alert('Please Login First');
            return;
        }
        setIsOpen(true);
    };

    const getButtonContent = () => {
        if (checkingStatus) return 'Loading...';
        if (enrollmentStatus?.status === 'active') return 'Already Enrolled';
        if (enrollmentStatus?.status === 'pending') return 'Verification Pending';
        if (enrollmentStatus?.status === 'rejected') return 'Enrollment Rejected - Try Again';
        return `Enroll Now - ${price}`;
    };

    const isButtonDisabled = checkingStatus || enrollmentStatus?.status === 'active' || enrollmentStatus?.status === 'pending';

    const getButtonStyle = () => {
        if (enrollmentStatus?.status === 'active') return 'bg-green-600 text-white cursor-default hover:bg-green-700';
        if (enrollmentStatus?.status === 'pending') return 'bg-yellow-500 text-white cursor-default hover:bg-yellow-600';
        if (enrollmentStatus?.status === 'rejected') return 'bg-red-600 text-white hover:bg-red-700';
        return 'bg-white text-black hover:bg-blue-600 hover:text-white border-2 border-transparent';
    };

    return (
        <>
            <button
                onClick={handleEnrollClick}
                disabled={isButtonDisabled}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors text-center w-full shadow-lg ${getButtonStyle()}`}
            >
                {getButtonContent()}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white text-black max-w-lg w-full p-8 rounded-2xl relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all"
                        >
                            <FaXmark size={20} />
                        </button>

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs block">Step {step} of 3</span>
                                {step < 4 && <div className="flex gap-1">
                                    {[1, 2, 3].map(i => <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`} />)}
                                </div>}
                            </div>

                            {step === 1 && <h3 className="text-3xl font-black uppercase">Select Campus</h3>}
                            {step === 2 && <h3 className="text-3xl font-black uppercase">Payment Info</h3>}
                            {step === 3 && <h3 className="text-3xl font-black uppercase">Verification</h3>}
                            {step === 4 && <h3 className="text-3xl font-black uppercase text-green-600">Request Sent!</h3>}
                        </div>

                        {/* STEP 1: BRANCH SELECTION */}
                        {step === 1 && (
                            <div className="space-y-4 mb-8">
                                <p className="text-gray-600 mb-4">Choose your preferred branch:</p>
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => setSelectedBranch(branch)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 relative group ${selectedBranch.id === branch.id
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedBranch.id === branch.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            {selectedBranch.id === branch.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <span className={`font-black uppercase tracking-wide block text-sm mb-1 ${selectedBranch.id === branch.id ? 'text-blue-900' : 'text-black'}`}>{branch.name}</span>
                                            <span className="text-xs text-gray-500 font-medium leading-relaxed block">{branch.address}</span>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-lg flex items-center justify-center gap-2 mt-4"
                                >
                                    Next: Payment <FaArrowRight />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT INFO */}
                        {step === 2 && (
                            <div className="space-y-6 mb-8">
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                                    <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-300">
                                        UPI QR CODE
                                    </div>
                                    <p className="font-bold text-sm uppercase mb-1">Scan to Pay: {price}</p>
                                    <p className="text-xs text-gray-500">Lets Dance Academy</p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                                    <h4 className="font-bold uppercase text-blue-800 mb-2">Bank Details</h4>
                                    <p>Account Name: <span className="font-bold">Lets Dance Academy</span></p>
                                    <p>Account No: <span className="font-bold">1234567890</span></p>
                                    <p>IFSC: <span className="font-bold">SBIN0001234</span></p>
                                </div>

                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-lg flex items-center justify-center gap-2"
                                >
                                    I have made the payment
                                </button>
                                <button onClick={() => setStep(1)} className="w-full text-center text-xs font-bold text-gray-400 hover:text-black mt-2">Back</button>
                            </div>
                        )}

                        {/* STEP 3: CONFIRMATION & UTR */}
                        {step === 3 && (
                            <div className="space-y-6 mb-8">
                                <p className="text-gray-600 text-sm">Please enter the UTR/Reference number from your payment confirmation.</p>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        UTR Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={utrNumber}
                                        onChange={(e) => setUtrNumber(e.target.value)}
                                        placeholder="Enter UTR/Transaction Reference Number"
                                        className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm font-bold focus:border-blue-600 focus:outline-none transition-colors placeholder:font-normal"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">The UTR number can be found in your payment confirmation</p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!utrNumber || submitting}
                                    className={`w-full bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-green-600 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Enrollment'}
                                </button>
                                <button onClick={() => setStep(2)} className="w-full text-center text-xs font-bold text-gray-400 hover:text-black mt-2">Back</button>
                            </div>
                        )}

                        {/* STEP 4: SUCCESS */}
                        {step === 4 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                    <FaCheck />
                                </div>
                                <h4 className="text-xl font-bold uppercase mb-2">Enrollment Pending</h4>
                                <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                    Your enrollment request has been submitted. The admin will verify your payment and activate your access shortly.
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}
