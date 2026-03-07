import Quiz from '../features/budget-game/components/Quiz';
import GameHub from '../features/budget-game/components/GameHub';

function App() {
  console.log('App imported Quiz and GameHub successfully');
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="p-8 bg-slate-800 rounded-lg">
        <h1 className="text-4xl font-bold">Testing App with Both Components...</h1>
        <p className="text-gray-300 mt-4">If you see this, both imports work!</p>
      </div>
    </div>
  );
}

export default App;
