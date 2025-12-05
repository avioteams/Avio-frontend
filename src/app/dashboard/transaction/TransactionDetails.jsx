import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { IconShare } from "@tabler/icons-react"

export default function TransactionDetails(){
    const [amount, setAmount] = useState('0.00')
    const [recipient, setRecipient] = useState('Recipient')
    const [status, setStatus] = useState('Transaction Status')
    const [condition, setCondition] = useState('Condition')
    const [hash, setHash] = useState('Transaction Hash')

    return (
        <div>
            <div className="px-8 py-2 pb-0">
                <img className="w-26" src="./Logo.svg" alt="" />
            </div>
            <div className="border-box inset-3 grid gap-8 mt-0 justify-items-center">
                <div className="grid gap-1 text-center">
                    <p>Release to {recipient}</p>
                    <h1 className='font-semibold text-4xl'>NGN {amount}</h1>
                    <p>{status}</p>
                </div>
                <Card className="lg:w-5/12 sm:w-screen md:w-screen">
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div className="flex w-full justify-between">
                            <CardDescription>Recipient Details</CardDescription>
                            <CardDescription className="text-right">Recipient Name <br />Bank <br />Account Name</CardDescription>
                        </div>
                        <div className="flex w-full justify-between">
                            <CardDescription>Status</CardDescription>
                            <CardDescription className="text-right">{status}</CardDescription>
                        </div>
                        <div className="flex w-full justify-between">
                            <CardDescription>Condition</CardDescription>
                            <CardDescription className="text-right">{condition}</CardDescription>
                        </div>
                        <div className="flex w-full justify-between">
                            <CardDescription>Transaction Hash</CardDescription>
                            <CardDescription className="text-right">{hash}</CardDescription>
                        </div>
                        <div className="flex w-full justify-between">
                            <CardDescription>Transaction Date</CardDescription>
                            <CardDescription className="text-right">Date</CardDescription>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-4">
                    <Button className="bg-secondary w-max rounded-full text-secondary-foreground">
                        Share 
                        <IconShare />
                    </Button>
                    <Button className="text-secondary w-max rounded-full border bg-secondary-foreground">
                        Back to Chat
                    </Button>
                </div>
            </div>
        </div>
    )
}