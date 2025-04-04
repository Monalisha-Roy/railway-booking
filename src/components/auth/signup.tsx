import { RiCloseFill } from "react-icons/ri";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firebase.config";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

interface SignupProps {
  show: boolean;
  onClose: () => void;
  switchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ show, onClose, switchToLogin }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
  
    // Validate phone number
    if (phone.length !== 10) {
      setError("Phone number must be 10 digits.");
      return;
    }
  
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      // Prepare user data without password
      const userData = {
        user_id: userId,
        name,
        email,
        phone_number: phone,
        password,
      };
  
      // Insert user data into database
      const response = await fetch('/api/insertUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
  
      onClose();
      router.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-50 ">
      <div className="relative sm:w-3/4 md:w-7/12 lg:w-4/12 h-auto py-6 md:py-8 lg:py-10 rounded-lg bg-white border border-text flex items-center justify-center">
        <div className="flex justify-center items-center  w-full">
          <div className="flex flex-col w-full px-9 md:px-12 lg:px-16">
            <h1 className="text-black font-semibold text-2xl md:text-3xl mb-3">
              Sign Up
            </h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col justify-center items-center gap-2">
              <form className="flex flex-col w-full" onSubmit={handleSignup}>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-black text-md mb-1">
                    Name
                  </label>
                  <input
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-gray-800 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-black text-md mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setPhone(value);
                      }
                    }}
                    className="text-gray-800 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                  {phone.length > 0 && phone.length < 10 && (
                    <p className="text-red-500 text-sm">
                      Phone number must be 10 digits.
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-black text-md mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-800 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-black text-md mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-800 text-sm mb-2 px-5 p-2 rounded-md border"
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    className="bg-[#7d97d9] hover:bg-[#263a69] text-lg mt-1 p-2 px-6 rounded-md text-white w-full font-bold"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              {/* <div className="flex justify-center items-center w-full">
                <hr className="border border-text border-t-0 w-1/4 mr-1" />
                <p className="text-xs md:text-sm text-text">Or continue with</p>
                <hr className="border border-text border-t-0 w-1/4 ml-1" />
              </div>

              <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-1 border border-background w-full text-lg p-2 rounded-md text-background bg-white">
                Sign in with Google<FcGoogle size={20} className="hover:cursor-pointer" />
              </button> */}
              <p className="text-sm text-text">Already have an account? <a onClick={switchToLogin} className="text-[#2c58c9] underline hover:cursor-pointer">Login</a></p>
            </div>
          </div>
          <div className="">
            {/* <Image
              src={"/loginPic.png"}
              alt={"anime image"}
              width={200}
              height={400}
            /> */}
          </div>
          <div className="absolute top-1 right-2 rounded-full">
            <button className="p-1 text-text" onClick={onClose} type="button">
              <RiCloseFill size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;