import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const INITIAL_FORM_STATE = {
  patientInfo: {
    name: '',
    age: '',
    sex: '',
    maritalStatus: '',
    appointmentNo: '',
    appointmentDate: '',
    // appointmentTime: '',
    problemDescription: '',
    address: '',
    contactNo: ''
  },
  diagnosisDetails: {
    diagnosis: '',
    symptoms: [''],
    prescriptions: [{
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    treatmentPlan: '',
    followUpDate: '',
    doctorNotes: ''
  }
};

const DiagnosisForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  const BASE_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/doctor/appointment/${id}`, {
          withCredentials: true
        });
        
        const { appointment } = response.data;
        
        setFormData(prev => ({
          ...prev,
          patientInfo: {
            ...prev.patientInfo,
            name: appointment.patientName,
            appointmentNo: appointment.appointmentNumber,
            appointmentDate: appointment.appointmentDate,
            // appointmentTime: appointment.appointmentTime,
            problemDescription: appointment.patientProblemDesc,
            address: appointment.patientAddress,
            contactNo: appointment.patientMobileNo
          }
        }));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching appointment details');
      }
    };

    if (id) {
      fetchAppointmentDetails();
    }
  }, [id]);

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toISOString().split('T')[0];
  // };

  const updatePatientInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value
      }
    }));
  };

  const updateDiagnosisDetails = (field, value) => {
    setFormData(prev => ({
      ...prev,
      diagnosisDetails: {
        ...prev.diagnosisDetails,
        [field]: value
      }
    }));
  };

  // Dynamic field handlers
  const handleSymptoms = {
    add: () => {
      setFormData(prev => ({
        ...prev,
        diagnosisDetails: {
          ...prev.diagnosisDetails,
          symptoms: [...prev.diagnosisDetails.symptoms, '']
        }
      }));
    },
    remove: (index) => {
      setFormData(prev => ({
        ...prev,
        diagnosisDetails: {
          ...prev.diagnosisDetails,
          symptoms: prev.diagnosisDetails.symptoms.filter((_, i) => i !== index)
        }
      }));
    },
    update: (index, value) => {
      setFormData(prev => {
        const newSymptoms = [...prev.diagnosisDetails.symptoms];
        newSymptoms[index] = value;
        return {
          ...prev,
          diagnosisDetails: {
            ...prev.diagnosisDetails,
            symptoms: newSymptoms
          }
        };
      });
    }
  };

  const handlePrescriptions = {
    add: () => {
      setFormData(prev => ({
        ...prev,
        diagnosisDetails: {
          ...prev.diagnosisDetails,
          prescriptions: [
            ...prev.diagnosisDetails.prescriptions,
            { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }
          ]
        }
      }));
    },
    remove: (index) => {
      setFormData(prev => ({
        ...prev,
        diagnosisDetails: {
          ...prev.diagnosisDetails,
          prescriptions: prev.diagnosisDetails.prescriptions.filter((_, i) => i !== index)
        }
      }));
    },
    update: (index, field, value) => {
      setFormData(prev => {
        const newPrescriptions = [...prev.diagnosisDetails.prescriptions];
        newPrescriptions[index] = {
          ...newPrescriptions[index],
          [field]: value
        };
        return {
          ...prev,
          diagnosisDetails: {
            ...prev.diagnosisDetails,
            prescriptions: newPrescriptions
          }
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/api/doctor/diagnosis`, {
        appointmentId: id,
        ...formData.diagnosisDetails,...formData.patientInfo
      }, {
        withCredentials: true
      });

      toast.success('Diagnosis saved successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving diagnosis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Medical Diagnosis Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={formData.patientInfo.name}
                  disabled
                  placeholder="Patient Name"
                />
                <Input
                  type="number"
                  value={formData.patientInfo.age}
                  onChange={(e) => updatePatientInfo('age', e.target.value)}
                  placeholder="Age"
                  required
                />
                <Select
                  value={formData.patientInfo.sex}
                  onValueChange={(value) => updatePatientInfo('sex', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.patientInfo.maritalStatus}
                  onValueChange={(value) => updatePatientInfo('maritalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Diagnosis Details Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Diagnosis Details</h3>
              
              {/* Main Diagnosis */}
              <div>
                <Textarea
                  value={formData.diagnosisDetails.diagnosis}
                  onChange={(e) => updateDiagnosisDetails('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis details"
                  required
                  className="min-h-[100px]"
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="font-medium">Symptoms</h4>
                {formData.diagnosisDetails.symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={symptom}
                      onChange={(e) => handleSymptoms.update(index, e.target.value)}
                      placeholder="Enter symptom"
                      className="flex-1"
                    />
                    {formData.diagnosisDetails.symptoms.length > 1 && (
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={() => handleSymptoms.remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={handleSymptoms.add}>
                  Add Symptom
                </Button>
              </div>

              {/* Prescriptions */}
              <div className="space-y-2">
                <h4 className="font-medium">Prescriptions</h4>
                {formData.diagnosisDetails.prescriptions.map((prescription, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Medication Name"
                      value={prescription.medicationName}
                      onChange={(e) => handlePrescriptions.update(index, 'medicationName', e.target.value)}
                    />
                    <Input
                      placeholder="Dosage"
                      value={prescription.dosage}
                      onChange={(e) => handlePrescriptions.update(index, 'dosage', e.target.value)}
                    />
                    <Input
                      placeholder="Frequency"
                      value={prescription.frequency}
                      onChange={(e) => handlePrescriptions.update(index, 'frequency', e.target.value)}
                    />
                    <Input
                      placeholder="Duration"
                      value={prescription.duration}
                      onChange={(e) => handlePrescriptions.update(index, 'duration', e.target.value)}
                    />
                    <Textarea
                      placeholder="Instructions"
                      value={prescription.instructions}
                      onChange={(e) => handlePrescriptions.update(index, 'instructions', e.target.value)}
                      className="col-span-2"
                    />
                    {formData.diagnosisDetails.prescriptions.length > 1 && (
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={() => handlePrescriptions.remove(index)}
                        className="col-span-2"
                      >
                        Remove Prescription
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={handlePrescriptions.add}>
                  Add Prescription
                </Button>
              </div>

              {/* Treatment Plan and Follow-up */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Follow-up Date</h4>
                  <Input
                    type="date"
                    value={formData.diagnosisDetails.followUpDate}
                    onChange={(e) => updateDiagnosisDetails('followUpDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Treatment Plan</h4>
                  <Textarea
                    value={formData.diagnosisDetails.treatmentPlan}
                    onChange={(e) => updateDiagnosisDetails('treatmentPlan', e.target.value)}
                    placeholder="Enter treatment plan"
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Doctor's Notes */}
              <div className="space-y-2">
                <h4 className="font-medium">Doctor's Notes</h4>
                <Textarea
                  value={formData.diagnosisDetails.doctorNotes}
                  onChange={(e) => updateDiagnosisDetails('doctorNotes', e.target.value)}
                  placeholder="Enter additional notes"
                  className="min-h-[100px]"
                />
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Diagnosis'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisForm;