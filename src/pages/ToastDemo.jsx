import { useToast } from '../contexts/ToastContext';

export default function ToastDemo() {
    const toast = useToast();

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Toast Notification Demo</h1>
            
            <div className="space-y-4">
                <button
                    onClick={() => toast.success('This is a success message!')}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                    Show Success Toast
                </button>
                
                <button
                    onClick={() => toast.error('This is an error message!')}
                    className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                >
                    Show Error Toast
                </button>
                
                <button
                    onClick={() => toast.warning('This is a warning message!')}
                    className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700"
                >
                    Show Warning Toast
                </button>
                
                <button
                    onClick={() => toast.info('This is an info message!')}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Show Info Toast
                </button>
                
                <button
                    onClick={() => {
                        toast.success('Message 1');
                        setTimeout(() => toast.error('Message 2'), 500);
                        setTimeout(() => toast.warning('Message 3'), 1000);
                        setTimeout(() => toast.info('Message 4'), 1500);
                    }}
                    className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                >
                    Show Multiple Toasts
                </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">Usage Example:</h3>
                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
{`import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const toast = useToast();
  
  const handleClick = () => {
    toast.success('Success!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}`}
                </pre>
            </div>
        </div>
    );
}
