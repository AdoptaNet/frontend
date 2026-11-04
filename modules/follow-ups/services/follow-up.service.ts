import { httpClient } from '@/shared/services/http-client';
import { API_ROUTES } from '@/shared/config/api-routes';
import type {
  FollowUpRecordItem,
  SubmitMilestonePayload,
  ReviewMilestonePayload,
  RequestPetReturnPayload,
  CoordinatePetReturnPayload,
  CompletePetReturnPayload,
  SimulateMilestoneTimePayload,
  PetReturnItem,
  FollowUpMilestoneItem,
} from '../models/follow-up.types';

export const followUpService = {
  async getFollowUps(): Promise<FollowUpRecordItem[]> {
    return httpClient.get<FollowUpRecordItem[]>(API_ROUTES.FOLLOW_UPS.BASE);
  },

  async getFollowUpDetail(id: string): Promise<FollowUpRecordItem> {
    return httpClient.get<FollowUpRecordItem>(API_ROUTES.FOLLOW_UPS.BY_ID(id));
  },

  async submitMilestoneEvidence(
    recordId: string,
    milestoneId: string,
    payload: SubmitMilestonePayload,
  ): Promise<FollowUpMilestoneItem> {
    return httpClient.post<FollowUpMilestoneItem>(
      API_ROUTES.FOLLOW_UPS.SUBMIT_EVIDENCE(recordId, milestoneId),
      payload,
    );
  },

  async reviewMilestone(
    recordId: string,
    milestoneId: string,
    payload: ReviewMilestonePayload,
  ): Promise<{ milestone: FollowUpMilestoneItem; record: FollowUpRecordItem }> {
    return httpClient.patch<{ milestone: FollowUpMilestoneItem; record: FollowUpRecordItem }>(
      API_ROUTES.FOLLOW_UPS.REVIEW_MILESTONE(recordId, milestoneId),
      payload,
    );
  },

  async requestPetReturn(
    recordId: string,
    payload: RequestPetReturnPayload,
  ): Promise<PetReturnItem> {
    return httpClient.post<PetReturnItem>(
      API_ROUTES.FOLLOW_UPS.REQUEST_RETURN(recordId),
      payload,
    );
  },

  async coordinatePetReturn(
    returnId: string,
    payload: CoordinatePetReturnPayload,
  ): Promise<PetReturnItem> {
    return httpClient.patch<PetReturnItem>(
      API_ROUTES.PET_RETURNS.COORDINATE(returnId),
      payload,
    );
  },

  async completePetReturn(
    returnId: string,
    payload: CompletePetReturnPayload,
  ): Promise<PetReturnItem> {
    return httpClient.patch<PetReturnItem>(
      API_ROUTES.PET_RETURNS.COMPLETE(returnId),
      payload,
    );
  },

  async simulateMilestoneTime(
    recordId: string,
    milestoneId: string,
    payload: SimulateMilestoneTimePayload,
  ): Promise<{ message: string; milestone: FollowUpMilestoneItem }> {
    return httpClient.post<{ message: string; milestone: FollowUpMilestoneItem }>(
      API_ROUTES.FOLLOW_UPS.SIMULATE_TIME(recordId, milestoneId),
      payload,
    );
  },

  async triggerCron(): Promise<{ scanned: number; remindersSent: number; overdueMarked: number }> {
    return httpClient.post<{ scanned: number; remindersSent: number; overdueMarked: number }>(
      API_ROUTES.FOLLOW_UPS.TRIGGER_CRON,
      {},
    );
  },

  async uploadPhoto(file: File): Promise<{ url: string; secureUrl: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await httpClient.post<{ url: string; publicId: string; secureUrl?: string }>(
      API_ROUTES.MEDIA.UPLOAD,
      formData,
    );
    return {
      url: res.url,
      secureUrl: res.secureUrl || res.url,
      publicId: res.publicId,
    };
  },
};
