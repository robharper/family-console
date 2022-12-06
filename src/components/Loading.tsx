import Squares2X2Icon from '@heroicons/react/24/solid/Squares2X2Icon';

export default function Loading() {
  return (
    <div className="grid h-screen place-items-center ">
      <Squares2X2Icon className="h-6 w-6 text-blue-500 animate-spin"/>
    </div>
  )
}