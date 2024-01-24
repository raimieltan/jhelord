"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useRef, useState } from "react";
import { User } from "../types/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineSmartphone } from "react-icons/md";
import ErrorAlert from "@/components/Alerts/ErrorAlert";
import SuccessAlert from "@/components/Alerts/SuccessAlert";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const router = useRouter();
  const fileInputRef = useRef();

  const [users, setUsers] = useState<User[]>([]);
  const [validationMessages, setValidationMessages] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
  });
  const [personalFormData, setPersonalFormData] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phoneNumber: '',
    email: '',
    role: 'DRIVER',
  });
  const [licenseNumber, setLicenseNumber] = useState('')
  const [unitFormData, setUnitFormData] = useState({
    model: '',
    make: '',
    number: '',
    plateNumber: '',
  });
  const [profileImage, setProfileImage] = useState<any>('/taxi-driver.webp');
  const [imagePreview, setImagePreview] = useState('/taxi-driver.webp');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  // Handle input changes
  const personalFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalFormData({
      ...personalFormData,
      [name]: value,
    });

    let message = '';

    if (name === "email") {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!re.test(value.toLowerCase())) {
        message = 'Invalid Email Address';
      }
    }

    if (name === "firstName") {
      const re = /^[a-zA-Z]*$/
      if (!re.test(value.toLowerCase())) {
        message = 'Invalid First Name'
      }
    }

    if (name === "lastName") {
      const re = /^[a-zA-Z]*$/
      if (!re.test(value.toLowerCase())) {
        message = 'Invalid Last Name'
      }
    }

    if (name === "username") {
      if (users.some(user => user.username === value)) {
        message = "Username already exists"
      } else {
        message = ''
      }
    }

    if (name === "phoneNumber") {
      const re = /^\d*$/
      if (!re.test(value)) {
        message = "Please enter a valid Phone Number"
      }
    }

    setValidationMessages({
      ...validationMessages,
      [name]: message,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const licenseNumberHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicenseNumber(e.target.value);
  };

  const unitFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitFormData({
      ...unitFormData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchUsers = async () => {
    const response = await fetch('https://jhelord-backend.onrender.com/api/users/username')
    const data = await response.json();
    setUsers(data);

  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle form submission
  const handleSubmit = async () => {
    const hasErrors = Object.values(validationMessages).some(message => message !== '');

    if (hasErrors) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 5000);
    } else {
      try {
        const formData = new FormData();

        Object.keys(personalFormData).forEach(key => {
          formData.append(key, personalFormData[key]);
        });

        if (profileImage) {
          formData.append('profileImage', profileImage);
        }

        const response = await fetch('https://jhelord-backend.onrender.com/api/users/signup-driver', {
          method: "POST",
          body: formData
        });
        const userData = await response.json();

        const driver = {
          licenseNumber,
          userId: userData.id,
        }

        const driverResponse = await fetch('https://jhelord-backend.onrender.com/api/drivers', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(driver),
        })
        const driverData = await driverResponse.json();

        const unit = {
          ...unitFormData,
          driverId: driverData.id,
          status: 'ACTIVE',
          location: {
            latitude: 10.746494047397272,
            longitude: 122.55620305514289,
          }
        }

        const unitResponse = await fetch('https://jhelord-backend.onrender.com/api/units', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(unit),
        })
        setShowSuccessToast(true);

        setTimeout(() => {
          setShowSuccessToast(false)
          router.push('/')
        }, 5000);
      } catch (error: any) {
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 5000);
        console.log(error.message);
      }
    }
  };


  return (
    <>
      {showErrorToast && <ErrorAlert />}

      {showSuccessToast && <SuccessAlert />}

      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Register Driver" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="p-7">
              <form>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="flex flex-r gap-x-4">
                        <div className="w-full flex flex-col">
                          <input
                            className="w-full rounded border border-stroke bg-gray p-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={personalFormData.firstName}
                            onChange={personalFormHandleChange}
                            placeholder="Input First Name"
                          />
                          <div>
                            {validationMessages.firstName && <p className="mt-2 text-sm text-meta-1">{validationMessages.firstName}</p>}
                          </div>
                        </div>
                        <div className="w-full flex flex-col">
                          <input
                            className="w-full rounded border border-stroke bg-gray p-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={personalFormData.lastName}
                            onChange={personalFormHandleChange}
                            placeholder="Input Last Name"
                            defaultValue=""
                          />
                          <div>
                            {validationMessages.lastName && <p className="mt-2 text-sm text-meta-1">{validationMessages.lastName}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="w-full flex flex-col">
                      <span className="absolute left-3.5 top-3.5 text-xl">
                        <MdOutlineSmartphone />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={personalFormData.phoneNumber}
                        onChange={personalFormHandleChange}
                        placeholder="Input Phone Number"
                        defaultValue=""
                      />
                      <div>
                        {validationMessages.phoneNumber && <p className="mt-2 text-sm text-meta-1">{validationMessages.phoneNumber}</p>}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="w-full flex flex-col">
                      <span className="absolute left-3.5 top-3.5 text-xl">
                        <MdOutlineMail />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        id="email"
                        value={personalFormData.email}
                        onChange={personalFormHandleChange}
                        placeholder="Input Email"
                      />
                      <div>
                        {validationMessages.email && <p className="mt-2 text-sm text-meta-1">{validationMessages.email}</p>}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Username
                  </label>
                  <div className="w-full flex flex-col">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="username"
                      id="Username"
                      value={personalFormData.username}
                      onChange={personalFormHandleChange}
                      placeholder="Create Username"
                    />
                    <div>
                      {validationMessages.username && <p className="mt-2 text-sm text-meta-1">{validationMessages.username}</p>}
                    </div>
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="w-full flex flex-col">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pr-11.5 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="Password"
                        value={personalFormData.password}
                        onChange={personalFormHandleChange}
                        placeholder="Create Password"
                        onFocus={() => setShowPassword(false)}
                      />
                      <span 
                        className="absolute right-3.5 top-3.5 text-xl"
                        onClick={togglePasswordVisibility}
                      >
                        {
                          showPassword ? <FaEyeSlash /> : <FaRegEye />
                        }
                        
                        
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="License Number"
                  >
                    License Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="licenseNumber"
                    id="LicenseNumber"
                    value={licenseNumber}
                    onChange={licenseNumberHandleChange}
                    placeholder="Input License Number"
                  />
                </div>
              </form>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    <Image
                      src={imagePreview}
                      width={55}
                      height={55}
                      alt="User"
                    />
                  </div>
                  <div>
                    <span className="mb-1.5 text-black dark:text-white">
                      Upload Driver photo
                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* TODO: ICON */}
                    <p>
                      <span className="text-primary">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>
              </form>

              <div className="border-b border-stroke py-2 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Unit
                </h3>
              </div>
              <form action="#">
                <div className="mb-5.5 mt-4 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="model"
                    >
                      Model
                    </label>
                    <div className="relative">
                      <div className="flex flex-col gap-y-4">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="model"
                          id="model"
                          value={unitFormData.model}
                          onChange={unitFormHandleChange}
                          placeholder="Input Model"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="make"
                    >
                      Make
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="make"
                      id="make"
                      value={unitFormData.make}
                      onChange={unitFormHandleChange}
                      placeholder="Input Make"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="number"
                  >
                    Unit Number
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="number"
                      id="number"
                      value={unitFormData.number}
                      onChange={unitFormHandleChange}
                      placeholder="Input Unit Number"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Plate Number"
                  >
                    Plate Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="plateNumber"
                    id="plateNumber"
                    value={unitFormData.plateNumber}
                    onChange={unitFormHandleChange}
                    placeholder="Input Plate Number"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4.5 mt-5">
          <button
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="submit"
          >
            Cancel
          </button>
          <button
            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
            type="submit"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
