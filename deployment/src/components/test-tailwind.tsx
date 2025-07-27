export function TestTailwind() {
  return (
    <div className="bg-red-500 text-white p-4 m-4 rounded-lg" style={{backgroundColor: 'red', color: 'white', padding: '16px', margin: '16px', borderRadius: '8px'}}>
      <h2 className="text-2xl font-bold" style={{fontSize: '24px', fontWeight: 'bold'}}>Tailwind CSS Test</h2>
      <p className="mt-2" style={{marginTop: '8px'}}>Jika Anda melihat background merah dan teks putih, Tailwind CSS bekerja!</p>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded mt-2" style={{background: 'linear-gradient(to right, #3b82f6, #9333ea)', padding: '8px', borderRadius: '4px', marginTop: '8px'}}>
        <p>Gradient juga harus terlihat</p>
      </div>
      <div className="text-xs mt-2">
        <p>Jika style inline terlihat tapi class Tailwind tidak, maka ada masalah dengan konfigurasi Tailwind.</p>
      </div>
    </div>
  );
}
