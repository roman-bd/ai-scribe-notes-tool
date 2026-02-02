import { Patient } from '../types';

interface Props {
  patient: Patient;
}

export default function PatientSidebar({ patient }: Props) {
  const formatDob = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAge = (birth: string) => {
    const birthDate = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>

      <dl className="space-y-3">
        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">Name</dt>
          <dd className="text-gray-900">{patient.name}</dd>
        </div>

        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</dt>
          <dd className="text-gray-900">{formatDob(patient.birthDate)}</dd>
        </div>

        <div>
          <dt className="text-xs text-gray-500 uppercase tracking-wide">Age</dt>
          <dd className="text-gray-900">{calculateAge(patient.birthDate)} years</dd>
        </div>
      </dl>
    </div>
  );
}
