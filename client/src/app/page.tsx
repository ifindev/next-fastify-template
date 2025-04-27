import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Management System</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Welcome to the Library Management System</h2>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>This system allows you to manage books, users, and track borrowing activities.</p>
              </div>
              <div className="mt-5">
                <Link 
                  href="/auth/login" 
                  className="btn-primary"
                >
                  Login to your account
                </Link>
                <Link 
                  href="/auth/register" 
                  className="ml-4 btn-secondary"
                >
                  Register a new account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Library Catalog</h3>
                <p className="mt-1 text-sm text-gray-500">Browse and search the complete catalog of books.</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Upload Books</h3>
                <p className="mt-1 text-sm text-gray-500">Upload and manage your collection of books.</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="mt-1 text-sm text-gray-500">Manage users and their permissions.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 