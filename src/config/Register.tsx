import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/config/supabaseClient'; // ✅ update path if needed

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('Restaurant');
  const navigate = useNavigate();

const handleRegister = async () => {
  console.log("🚀 Trying to register...");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: userType,
      },
    },
  });

  if (error) {
    alert("❌ Signup failed: " + error.message);
    return;
  }

  const user = data.user;
  if (!user) {
    alert("❌ Signup failed: no user returned");
    return;
  }

  // Pick correct table
  let tableName = "";
  switch (userType) {
    case "Restaurant":
      tableName = "Restaurants";
      break;
    case "Charity":
      tableName = "Charity";
      break;
    case "Shelter":
      tableName = "Shelter";
      break;
    case "Factory":
      tableName = "Factory";
      break;
    case "Hotel":
      tableName = "Hotels";
      break;
    case "Supermarket":
      tableName = "Supermarkets";
      break;
    case "Other":
      tableName = "Other";
      break;
    default:
      alert("❌ Unknown user type selected");
      return;
  }

  // Insert into selected table
  const insertResult = await supabase.from(tableName).insert([
    {
      id: user.id, // match auth UID
      email: user.email,
      Role: userType,
      Status: "Inactive",
    },
  ]);

  if (insertResult.error) {
    console.error("❌ Insert Error:", insertResult.error);
    alert("Signup succeeded, but failed to save user in database.");
    return;
  }

  alert("✅ Signup and database insert successful!");
  navigate("/login");
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Who Are You?</label>
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      >
        <optgroup label="Organizations">
          <option value="Restaurant">Restaurant</option>
          <option value="Hotel">Hotel</option>
          <option value="Supermarket">Supermarket</option>
          <option value="Other">Other</option>
        </optgroup>
        <optgroup label="Charities">
          <option value="Charity">Charity</option>
          <option value="Shelter">Shelter</option>
        </optgroup>
        <optgroup label="Factories">
          <option value="Factory">Factory</option>
        </optgroup>
      </select>

      <button
        onClick={handleRegister}
        className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
