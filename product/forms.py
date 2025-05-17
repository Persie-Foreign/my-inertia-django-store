from django import forms
from .models import Product, Category, Review

class MultiFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class ProductForm(forms.ModelForm):
    images = forms.FileField(
        widget=MultiFileInput(attrs={'multiple': True}),
        required=False,
        label="Product Images"
    )

    class Meta:
        model  = Product
        fields = ['title', 'description', 'price', 'category']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        qs = Category.objects.filter(parent__isnull=False).select_related('parent')
        self.fields['category'].queryset = qs
        self.fields['category'].label_from_instance = \
            lambda obj: f"{obj.parent.name} → {obj.name}"

    def clean_images(self):
        # Return list of UploadedFile objects
        return self.files.getlist('images')

class ReviewForm(forms.ModelForm):
    class Meta:
        model  = Review
        fields = ['comment']
        widgets = {
            'comment': forms.Textarea(attrs={'rows':3, 'placeholder':'Write your review…'})
        }
