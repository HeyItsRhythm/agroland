import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';


import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ language, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin role is not available for registration, only buyer and seller roles are allowed
  const roleOptions = [
    {
      value: 'buyer',
      label: language === 'en' ? 'Buyer' : 'ખરીદદાર',
      description: language === 'en' ?'Search and purchase agricultural land' :'કૃષિ જમીન શોધો અને ખરીદો'
    },
    {
      value: 'seller',
      label: language === 'en' ? 'Seller' : 'વેચનાર',
      description: language === 'en' ?'List and sell your agricultural properties' :'તમારી કૃષિ મિલકતો સૂચિબદ્ધ કરો અને વેચો'
    }
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = language === 'en' ? 'Name is required' : 'નામ આવશ્યક છે';
    } else if (formData.name.trim().length < 2) {
      errors.name = language === 'en' ? 'Name must be at least 2 characters' : 'નામ ઓછામાં ઓછા 2 અક્ષરોનું હોવું જોઈએ';
    }
    
    if (!formData.email) {
      errors.email = language === 'en' ? 'Email is required' : 'ઇમેઇલ આવશ્યક છે';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = language === 'en' ? 'Please enter a valid email' : 'કૃપા કરીને માન્ય ઇમેઇલ દાખલ કરો';
    }
    
    if (!formData.mobile) {
      errors.mobile = language === 'en' ? 'Mobile number is required' : 'મોબાઇલ નંબર આવશ્યક છે';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'કૃપા કરીને માન્ય 10 અંકનો મોબાઇલ નંબર દાખલ કરો';
    }
    
    if (!formData.password) {
      errors.password = language === 'en' ? 'Password is required' : 'પાસવર્ડ આવશ્યક છે';
    } else if (formData.password.length < 6) {
      errors.password = language === 'en' ? 'Password must be at least 6 characters' : 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરોનો હોવો જોઈએ';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = language === 'en' ? 'Please confirm your password' : 'કૃપા કરીને તમારો પાસવર્ડ પુષ્ટિ કરો';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = language === 'en' ? 'Passwords do not match' : 'પાસવર્ડ મેળ ખાતા નથી';
    }
    
    if (!formData.role) {
      errors.role = language === 'en' ? 'Please select your role' : 'કૃપા કરીને તમારી ભૂમિકા પસંદ કરો';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = language === 'en' ? 'You must agree to the terms and conditions' : 'તમારે નિયમો અને શરતો સાથે સંમત થવું આવશ્યક છે';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
    if (formErrors.role) {
      setFormErrors(prev => ({ ...prev, role: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <Input
        label={language === 'en' ? 'Full Name' : 'પૂરું નામ'}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={language === 'en' ? 'Enter your full name' : 'તમારું પૂરું નામ દાખલ કરો'}
        error={formErrors.name}
        required
      />

      <Input
        label={language === 'en' ? 'Email Address' : 'ઇમેઇલ સરનામું'}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder={language === 'en' ? 'Enter your email' : 'તમારું ઇમેઇલ દાખલ કરો'}
        error={formErrors.email}
        required
      />

      <Input
        label={language === 'en' ? 'Mobile Number' : 'મોબાઇલ નંબર'}
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder={language === 'en' ? 'Enter 10-digit mobile number' : '10 અંકનો મોબાઇલ નંબર દાખલ કરો'}
        error={formErrors.mobile}
        required
      />

      <Select
        label={language === 'en' ? 'Select Role' : 'ભૂમિકા પસંદ કરો'}
        options={roleOptions}
        value={formData.role}
        onChange={handleRoleChange}
        placeholder={language === 'en' ? 'Choose your role' : 'તમારી ભૂમિકા પસંદ કરો'}
        error={formErrors.role}
        required
      />

      <div className="relative">
        <Input
          label={language === 'en' ? 'Password' : 'પાસવર્ડ'}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Create a password' : 'પાસવર્ડ બનાવો'}
          error={formErrors.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
        </button>
      </div>

      <div className="relative">
        <Input
          label={language === 'en' ? 'Confirm Password' : 'પાસવર્ડ પુષ્ટિ કરો'}
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Confirm your password' : 'તમારો પાસવર્ડ પુષ્ટિ કરો'}
          error={formErrors.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
        </button>
      </div>

      <Checkbox
        label={
          <span className="text-sm">
            {language === 'en' ? 'I agree to the ' : 'હું '}
            <Link to="/terms-of-service" className="text-primary hover:text-primary/80 transition-micro">
              {language === 'en' ? 'Terms and Conditions' : 'નિયમો અને શરતો'}
            </Link>
            {language === 'en' ? ' and ' : ' અને '}
            <Link to="/privacy-policy" className="text-primary hover:text-primary/80 transition-micro">
              {language === 'en' ? 'Privacy Policy' : 'ગોપનીયતા નીતિ'}
            </Link>
            {language === 'en' ? '' : ' સાથે સંમત છું'}
          </span>

        }
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleChange}
        error={formErrors.agreeToTerms}
        required
      />

      <Button
        type="submit"
        variant="default"
        loading={loading}
        fullWidth
        className="mt-6"
      >
        {language === 'en' ? 'Create Account' : 'ખાતું બનાવો'}
      </Button>
    </form>
  );
};

export default RegisterForm;