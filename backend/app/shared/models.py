"""
Shared Database Models for Partner Companies and Partnership Opportunities
"""
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.shared.db import Base

class PartnerCompany(Base):
    __tablename__ = "partner_companies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    primary_opportunities: Mapped[List["PartnershipOpportunity"]] = relationship(
        "PartnershipOpportunity", foreign_keys="PartnershipOpportunity.primary_company_id", back_populates="primary_company"
    )
    partner_opportunities: Mapped[List["PartnershipOpportunity"]] = relationship(
        "PartnershipOpportunity", foreign_keys="PartnershipOpportunity.partner_company_id", back_populates="partner_company"
    )

class PartnershipOpportunity(Base):
    __tablename__ = "partnership_opportunities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    primary_company_id: Mapped[str] = mapped_column(String(36), ForeignKey("partner_companies.id"), nullable=False)
    partner_company_id: Mapped[str] = mapped_column(String(36), ForeignKey("partner_companies.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    compatibility_score: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="discovered")
    stage: Mapped[str] = mapped_column(String(50), default="EVALUATED")
    strategic_fit_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Sender Identity Fields
    sender_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    sender_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    sender_company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Rich JSON Payloads
    evidence_signals: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    founder_intel: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    reasoning_card: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    outreach_drafts: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    timeline_events: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    primary_company: Mapped[PartnerCompany] = relationship("PartnerCompany", foreign_keys=[primary_company_id], back_populates="primary_opportunities")
    partner_company: Mapped[PartnerCompany] = relationship("PartnerCompany", foreign_keys=[partner_company_id], back_populates="partner_opportunities")
