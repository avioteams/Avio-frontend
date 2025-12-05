import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Escrow(){
    return(
        <div className='grid gap-6'>
            <div className="bg-primary text-primary-foreground p-12 pt-6 pb-0 rounded-3xl">
                <div className="flex justify-between">
                    <div className="mt-2 mb-12 grid gap-12">
                        <h1 className="font-normal text-6xl tracking-wider">Create a Mutual <br />Agreement</h1>
                        <Button className="bg-secondary w-max rounded-full text-secondary-foreground">Create an Agreement</Button>
                    </div>
                    <div className="w-54">
                        <img src="../black wallet with money.png" alt="" />
                    </div>
                </div>
            </div>
            <div className='flex gap-6'>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Escrow Status</CardTitle>
                        <CardDescription>Locked Amount</CardDescription>
                        <CardAction>Card Action</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className='font-semibold text-4xl tracking-wider'>NGN50,000</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="bg-secondary w-max rounded-full text-secondary-foreground">Rule Preview</Button>
                    </CardFooter>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Escrow</CardTitle>
                        <CardDescription>Total Agreements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='font-semibold text-4xl tracking-wider'>5</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="bg-secondary w-max rounded-full text-secondary-foreground">View Agreements</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}