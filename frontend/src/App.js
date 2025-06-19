import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

function App() {
  const [topUsers, setTopUsers] = useState([]);
  const [validCount, setValidCount] = useState(0);

  useEffect(() => {
    loadUsers();
    socket.on('nav_rank_updated', (data) => {
      console.log('Socket update:', data);
      loadUsers();
    });
  }, []);

 const loadUsers = async () => {
  const res = await axios.get('http://localhost:3000/account/top?sortBy=rank');
  const count = await axios.get('http://localhost:3000/account/count-valid');
  
  setTopUsers(res.data);
  setValidCount(count.data.count);
};

return (
  <>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const payload = {
          student_id: formData.get("student_id"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          university_name: formData.get("university_name"),
          university_code: formData.get("university_code"),
          referrer: formData.get("referrer"),
        };

        await axios.post("http://localhost:3000/account/register", payload);
        alert("Đăng ký thành công");
        loadUsers();
        form.reset();
      }}
      className="mb-6 p-4 border rounded"
    >
      <h2 className="text-xl font-semibold mb-2">Đăng ký tài khoản</h2>
      <input name="student_id" placeholder="Mã SV" required className="block w-full mb-2 p-2 border" />
      <input name="email" type="email" placeholder="Email" required className="block w-full mb-2 p-2 border" />
      <input name="phone" placeholder="Số điện thoại" required className="block w-full mb-2 p-2 border" />
      <input name="university_name" placeholder="Tên trường" required className="block w-full mb-2 p-2 border" />
      <input name="university_code" placeholder="Mã trường" required className="block w-full mb-2 p-2 border" />
      <input name="referrer" placeholder="Người giới thiệu (nếu có)" className="block w-full mb-2 p-2 border" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Đăng ký</button>
    </form>

    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản CK</h1>
      <p className="mb-2">Số sinh viên đã duyệt: <strong>{validCount}</strong></p>
      <h2 className="text-xl mt-4 font-semibold">Top 10 theo NAV:</h2>
      <ul className="list-decimal ml-6">
        {topUsers.map((user, i) => (
          <li key={i}>
            {user.student_id} - {user.university_name} - NAV: {user.nav} - Rank: {user.rank}
          </li>
        ))}
      </ul>
    </div>
  </>
);
}

export default App;
