import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { UserPlus, Users } from 'lucide-react'
import { Button } from './ui/button'

const NoFollowsCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">Nu urmărești pe nimeni</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          După ce vei urmări utilizatori, postările lor vor apărea aici în feed-ul tău.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
      </CardContent>
    </Card>
  )
}

export default NoFollowsCard