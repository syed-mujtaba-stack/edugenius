import { NextRequest, NextResponse } from 'next/server'
import { supabaseUserStatsService } from '@/lib/supabaseUserStatsService'

export async function POST(request: NextRequest) {
  try {
    const { activityType, activityData, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Log the activity directly with Supabase
    await supabaseUserStatsService.logActivity(userId, {
      activity_type: activityType,
      activity_data: activityData
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Activity tracked successfully' 
    })
  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' }, 
      { status: 500 }
    )
  }
}