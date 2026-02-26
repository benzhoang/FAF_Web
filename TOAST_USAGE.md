# Toast Notification Usage Guide

## 📢 How to Use Toast Notifications

The toast notification system has been added to the application. Here's how to use it:

### 1. Import the hook
```javascript
import { useToast } from '../contexts/ToastContext';
```

### 2. Use in your component
```javascript
function MyComponent() {
    const toast = useToast();
    
    const handleSuccess = () => {
        toast.success('Operation completed successfully!');
    };
    
    const handleError = () => {
        toast.error('Something went wrong!');
    };
    
    const handleWarning = () => {
        toast.warning('Please be careful!');
    };
    
    const handleInfo = () => {
        toast.info('Here is some information');
    };
    
    return (
        <div>
            <button onClick={handleSuccess}>Show Success</button>
            <button onClick={handleError}>Show Error</button>
            <button onClick={handleWarning}>Show Warning</button>
            <button onClick={handleInfo}>Show Info</button>
        </div>
    );
}
```

### 3. Custom Duration
By default, toasts disappear after 3 seconds. You can customize this:

```javascript
// Show for 5 seconds
toast.success('Message', 5000);

// Show indefinitely (manual close only)
toast.error('Critical error', 0);
```

## 🎨 Toast Types

- **Success** (Green): `toast.success('Success message')`
- **Error** (Red): `toast.error('Error message')`
- **Warning** (Yellow): `toast.warning('Warning message')`  
- **Info** (Blue): `toast.info('Info message')`

## 📍 Examples

### Replace alert() with toast

**Before:**
```javascript
alert('Contract signed successfully!');
```

**After:**
```javascript
toast.success('Contract signed successfully!');
```

### API Error Handling

```javascript
try {
    await api.submitCheckpoint(data);
    toast.success('Checkpoint submitted successfully!');
} catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit checkpoint');
}
```

### Form Validation

```javascript
if (!formData.email) {
    toast.warning('Please enter your email address');
    return;
}
```

## 🔧 Features

✅ Auto-dismiss after 3 seconds (customizable)  
✅ Multiple toasts stack nicely  
✅ Smooth slide-in animation  
✅ Manual close button  
✅ 4 types: success, error, warning, info  
✅ Works everywhere in the app  
✅ Mobile responsive  
✅ Beautiful modern design
