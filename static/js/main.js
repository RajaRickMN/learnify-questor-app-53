
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggling
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check if user has a theme preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
        document.documentElement.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        sunIcon.classList.toggle('hidden', isDark);
        moonIcon.classList.toggle('hidden', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // File upload functionality
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // Check if file is an Excel file
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                showToast('Error', 'Please upload an Excel file (.xlsx or .xls)', 'error');
                return;
            }
            
            // Create FormData and upload
            const formData = new FormData();
            formData.append('file', file);
            
            // Show loading state
            showToast('Uploading', 'Please wait while we process your file...', 'loading');
            
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showToast('Error', data.error, 'error');
                } else {
                    showToast('Success', 'File uploaded successfully', 'success');
                    // Refresh page to show new data
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch(error => {
                showToast('Error', 'An error occurred while uploading the file', 'error');
                console.error('Upload error:', error);
            });
        }
    });
    
    // Simple toast notification system
    function showToast(title, message, type = 'info') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast elements
        const toast = document.createElement('div');
        toast.className = 'toast-notification fixed top-4 right-4 max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in';
        toast.style.borderLeft = '4px solid';
        
        // Set color based on type
        if (type === 'success') {
            toast.style.borderColor = '#10b981';
        } else if (type === 'error') {
            toast.style.borderColor = '#ef4444';
        } else if (type === 'loading') {
            toast.style.borderColor = '#3b82f6';
        } else {
            toast.style.borderColor = '#6b7280';
        }
        
        // Toast content
        const content = document.createElement('div');
        content.className = 'flex p-4';
        
        // Icon
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'flex-shrink-0 mr-3';
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        } else if (type === 'loading') {
            iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" class="animate-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="30 60" stroke-linecap="round"></circle></svg>';
        } else {
            iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }
        
        iconWrapper.innerHTML = iconSvg;
        
        // Text content
        const textContent = document.createElement('div');
        
        const titleElement = document.createElement('p');
        titleElement.className = 'font-medium';
        titleElement.textContent = title;
        
        const messageElement = document.createElement('p');
        messageElement.className = 'text-sm text-gray-500 dark:text-gray-400 mt-1';
        messageElement.textContent = message;
        
        textContent.appendChild(titleElement);
        textContent.appendChild(messageElement);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-2 right-2 text-gray-400 hover:text-gray-600';
        closeButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeButton.addEventListener('click', () => toast.remove());
        
        // Progress bar (except for loading)
        if (type !== 'loading') {
            const progressBar = document.createElement('div');
            progressBar.className = 'h-1 bg-gray-200 dark:bg-gray-700 w-full';
            
            const progress = document.createElement('div');
            progress.className = 'h-1 w-full';
            
            if (type === 'success') {
                progress.className += ' bg-green-500';
            } else if (type === 'error') {
                progress.className += ' bg-red-500';
            } else {
                progress.className += ' bg-blue-500';
            }
            
            // Animate progress bar to disappear
            progress.style.transition = 'width 5s linear';
            progressBar.appendChild(progress);
            
            // Add progress bar to toast
            toast.appendChild(progressBar);
            
            // Start animation after a small delay
            setTimeout(() => {
                progress.style.width = '0';
            }, 100);
            
            // Remove toast after animation completes
            setTimeout(() => {
                toast.remove();
            }, 5000);
        }
        
        // Assemble and add to DOM
        content.appendChild(iconWrapper);
        content.appendChild(textContent);
        toast.appendChild(content);
        toast.appendChild(closeButton);
        
        document.body.appendChild(toast);
    }
});
