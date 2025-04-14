"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUserId } from "./user_id";

interface EmailAndNameContextType {
  name: string | null;
  email: string | null;
}

const EmailAndNameContext = createContext<EmailAndNameContextType>({
  name: null,
  email: null,
});

export const EmailAndNameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { user_id } = useUserId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getdata?user_id=${user_id}`, {
          method: "GET",
        });
        if (response.ok) {
          const jsonData = await response.json();
          if (jsonData.length > 0) {
            const { name, email } = jsonData[0];
            setName(name);
            setEmail(email);
            console.log(jsonData);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  return (
    <EmailAndNameContext.Provider value={{ name, email }}>
      {children}
    </EmailAndNameContext.Provider>
  );
};

export const useEmailAndName = (): EmailAndNameContextType =>
  useContext(EmailAndNameContext);
